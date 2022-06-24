import * as anchor from "./anchor";
import * as scatter from "./scatter";
import * as storage from "./storage";
// import * as analytics from "./analytics";
import { Action } from "scatter-ts";
import { PermissionLevel, Signature, SignedTransaction, Transaction } from "anchor-link";

export interface Wallet {
  actor: string;
  permission: string;
  publicKey: string;
  wallet: string;
  protocol: string;
  chain: string;
}

async function handleScatter(actions: Action[]) {
  console.log('lib/wallet::handleScatter', { actions });
  await scatter.login();
  const { transaction_id } = (await scatter.transact(actions) as any)
  return transaction_id;
}


async function cosignTransaction(trx: Transaction, auth: PermissionLevel): Promise<{transaction: Transaction, signatures: Signature[]}> {

  // return { transaction: trx, signatures: []}
  console.log('🪰', JSON.stringify(trx.toJSON()))
  const resp = await fetch("http://localhost:8080/cosign_trx", {
    "headers": {
      "accept": "*/*",
      "content-type": "application/json",
    },
    "body": `{\"ref\":\"pomelo\",\"transaction\":${JSON.stringify(trx.toJSON())},\"signer\":{\"actor\":\"${auth.actor}\",\"permission\":\"${auth.permission}\"}}`,
    "method": "POST"
  });
  const { data } = await resp.json();

  console.log('🐠', data)

  return {
    transaction: Transaction.from(data.transaction),
    signatures: data.signatures.map((sign: string) => Signature.from(sign))
  };
}

async function handleAnchor(actions: Action[]) {
  console.log('lib/wallet::handleAnchor', { actions });
  const session = await anchor.login();
  if (!session) return "";

  console.log('🦐', session, session.auth.toString())

  const [ info, abis ] = await Promise.all([
    session.client.v1.chain.get_info(),
    session.client.v1.chain.get_abi(actions[0].account)
  ]);
  const header = info.getTransactionHeader(300) // 300 = seconds this cosigned transaction is valid for
  console.log('🐏', header)

  const trx = Transaction.from({
    ...header,
    actions
  }, abis.abi);
  console.log('🦖', trx)

  const { transaction, signatures } = await cosignTransaction( trx, session.auth );
  console.log('🥒', transaction, signatures)

  console.log('🍅', JSON.stringify(transaction.toJSON(), null, 2))
  const result = await session.transact({ transaction }, { broadcast: false });
  console.log('🐞', result)

  // Sign the modified transaction
  const signedTransaction = SignedTransaction.from( result.transaction )

  signedTransaction.signatures = [
    ...result.signatures,
    ...signatures,
  ]

  console.log('🦂', JSON.stringify(signedTransaction.toJSON(), null, 2));

  const response = await session.client.v1.chain.push_transaction( signedTransaction )

  console.log('🐡', response)

  return response.transaction_id;
}

export function pushTransaction(actions: Action[], walletProtocol = "anchor") {
  console.log('lib/wallet::pushTransaction', { actions, walletProtocol });

  // input validation
  if (!walletProtocol) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] is required" });
  if (!actions) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is required" });
  if (!actions.length) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is empty" });

  // handle different wallet protocols
  if (walletProtocol == "anchor") return handleAnchor(actions);
  else if (walletProtocol == "scatter") return handleScatter(actions);
  throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] must be 'scatter|anchor'" });
}

export function getWallet() {
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    const { isTokenPocket, isMYKEY, isTrust, isImToken, isMathWallet, isLeafWallet, isCoinbaseWallet, isHbWallet } = ethereum;
    if (isTokenPocket) return 'tokenpocket';
    if (isMYKEY) return 'mykey';
    if (isTrust) return 'start';
    if (isImToken) return 'imtoken';
    if (isMathWallet) return 'math';
    if (isLeafWallet) return 'leaf';        // how to properly detect Leaf?

    // // not functional
    // if (isCoinbaseWallet) return 'coinbase';
    // if (isHbWallet) return 'huobi'
  }
  if ((window as any).__wombat__) return 'wombat';
  return null;
}

export function save( payload: Wallet) {
  storage.add("user-v.0.0.1", payload);
}

export function get(): Wallet {
  return storage.get("user-v.0.0.1");
}

export function remove() {
  return storage.remove("user-v.0.0.1");
}

export function exists() {
  return Object.keys(get() || {}).length > 0;
}

export function getWalletProtocol() {
  switch (getWallet()) {
    case "tokenpocket":
    case "mykey":
    case "wombat":
    case "start":
    case "imtoken":
    case "math":
    case "leaf":
      // not functional
      // case 'coinbase':
      // case 'huobi':
      return "scatter";
  }
  return null;
}
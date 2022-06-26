import * as anchor from "./anchor";
import * as scatter from "./scatter";
import * as storage from "./storage";
// import * as analytics from "./analytics";
import { Action } from "scatter-ts";
import { ABI, ABIDef, Checksum256, PermissionLevel, PrivateKey, Signature, SignedTransaction, Transaction } from "anchor-link";

const COSIGN_ENDPOINT = "https://us-central1-eosn-functions.cloudfunctions.net/freecpu/v1/freecpu/cosign"
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

async function cosignTransactionBackend(transaction: Transaction, signer: PermissionLevel): Promise<{transaction: Transaction, signatures: Signature[]}> {

  const resp = await fetch(COSIGN_ENDPOINT, {
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
        signer,
        transaction,
    }),
    method: "POST"
  });

  if(resp.status != 200) return { transaction, signatures: [] };

  const { data } = await resp.json();

  return {
    transaction: Transaction.from(data.transaction),
    signatures: data.signatures.map((sign: string) => Signature.from(sign))
  };
}



async function handleAnchor(actions: Action[]) {
  console.log('lib/wallet::handleAnchor', { actions });
  const session = await anchor.login();
  if (!session) return "";

  // get chain info and ABIs for action contracts
  const [ info, ...abis ] = await Promise.all([
    session.client.v1.chain.get_info(),
    ...actions.map(action => session.client.v1.chain.get_abi(action.account))
  ]);

  // build the inital transaction
  const trx = Transaction.from({
      ...info.getTransactionHeader(300),
      actions
    },
    abis.map(abi => ({ contract: abi.account_name, abi: abi.abi as ABIDef }))
  );

  // query backend for signed transaction with prepended noop action
  const cosigned = await cosignTransactionBackend(trx, session.auth);

  // submit to anchor for user to sign without broadcasting
  const result = await session.transact({ transaction: cosigned.transaction }, { broadcast: false });

  // merge signatures
  const signedTransaction = SignedTransaction.from({
    ...result.transaction,
    signatures: [
      ...result.signatures,
      ...cosigned.signatures,
    ]
  })

  // broadcast the transaction
  const response = await session.client.v1.chain.push_transaction( signedTransaction )

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
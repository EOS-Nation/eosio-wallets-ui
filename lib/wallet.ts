import * as anchor from "./anchor";
import * as scatter from "./scatter";
import * as storage from "./storage";
// import * as analytics from "./analytics";
import { Action } from "scatter-ts";
import { ABI, ABIDef, Checksum256, PermissionLevel, PrivateKey, Signature, SignedTransaction, Transaction } from "anchor-link";

const COSIGN_ENDPOINT = "http://localhost:8080/cosign"
export interface Wallet {
  actor: string;
  permission: string;
  publicKey: string;
  wallet: string;
  protocol: string;
  chain: string;
}

async function cosignTransactionBackend(actions: Action[]): Promise<{transaction: any, signatures: string[]} | undefined> {

  try {
    const resp = await fetch(COSIGN_ENDPOINT, {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
          transaction: {
            actions
          },
      }),
      method: "POST"
    });

    if(resp.status != 200) throw `Failed to fetch trx from ${COSIGN_ENDPOINT}. Status: ${resp.status}`;

    const { data } = await resp.json();

    return {
      transaction: data.transaction,
      signatures: data.signatures
    };
  }
  catch (err: any) {
    console.log(`handleAnchor(): Failed to fetch free cpu.`, err.message ?? err)
    return undefined;
  }
}


async function handleScatter(actions: Action[]) {
  console.log('lib/wallet::handleScatter', { actions });
  await scatter.login();

  const cosigned = await cosignTransactionBackend(actions);
  console.log('🐡', cosigned)
  if (!cosigned) {
    // if failed to cosign - just sign via wallet
    const { transaction_id } = (await scatter.transact(actions) as any)
    return transaction_id;
  }

  // const act = cosigned.transaction.actions.shift();
  const signed = await scatter.sign(cosigned.transaction)
  console.log('🐙', signed)
  signed.signatures.unshift( cosigned.signatures[0] )

  const response = await scatter.push(signed)

  return response.transaction_id;
}


async function handleAnchor(actions: Action[]) {
  console.log('lib/wallet::handleAnchor', { actions });
  const session = await anchor.login();
  if (!session) return "";

  const cosigned = await cosignTransactionBackend(actions);
  if (!cosigned) {
    // if failed to cosign - just sign via wallet
    const { transaction } = await session.transact({ actions });
    return transaction.id.toString();
  }

  // submit to anchor for user to sign without broadcasting
  const local = await session.transact({ ... cosigned.transaction }, { broadcast: false });

  // merge signatures and broadcast the transaction
  const response = await session.client.v1.chain.push_transaction(
    SignedTransaction.from({
      ...local.transaction,
      signatures: [
        ...local.signatures,
        ...cosigned.signatures,
      ]
    })
  );

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
import * as anchor from "./anchor";
import * as scatter from "./scatter";
import * as storage from "./storage";
// import * as analytics from "./analytics";
import { cosignTransactionBackend } from "./cosign";
import { Action } from "eosjs/dist/eosjs-serialize";
import { SignedTransaction } from "anchor-link";

export interface Wallet {
  actor: string;
  permission: string;
  publicKey: string;
  wallet: string;
  protocol: string;
  chain: string;
}

async function handleScatter(actions: Action[], cosign: Boolean, flash: ((message: string, type: 'error'|'success'|'warning'|'info') => void) | undefined) {
  console.log('lib/wallet::handleScatter', { actions, cosign });
  const account = await scatter.login();

  const cosigned = cosign ? await cosignTransactionBackend(actions, { actor: account.name, permission: account.authority }) : false;
  if (!cosigned) {
    // if failed to cosign - just sign via wallet
    const { transaction_id } = (await scatter.transact(actions) as any)
    return transaction_id;
  }

  try {
    // sign with scatter wallet without broadcasting
    const signed = await scatter.sign(cosigned.transaction)

    // add backend signature
    signed.signatures.push( cosigned.signatures[0] )

    // broadcast the transaction
    const response = await scatter.push(signed)
    return response.transaction_id;
  }
  catch(err: any) {
    // if failed to sign/push - just sign original actions
    if(flash && cosigned) flash(`Failed to cosign: ${err.message ?? err}`, 'warning')
    const { transaction_id } = (await scatter.transact(actions) as any)
    return transaction_id;
  }
}


async function handleAnchor(actions: Action[], cosign: Boolean, flash: ((message: string, type: 'error'|'success'|'warning'|'info') => void) | undefined) {
  console.log('lib/wallet::handleAnchor', { actions, cosign });
  const session = await anchor.login();
  if (!session) return "";

  const cosigned = cosign ? await cosignTransactionBackend(actions, {actor: session.auth.actor.toString(), permission: session.auth.permission.toString()}) : false;
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

export function pushTransaction(actions: Action[], walletProtocol = "anchor", cosign = false, flash: ((message: string, type: 'error'|'success'|'warning'|'info') => void) | undefined = undefined) {
  console.log('lib/wallet::pushTransaction', { actions, walletProtocol, cosign });

  // input validation
  if (!walletProtocol) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[walletProtocol] is required" });
  if (!actions) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is required" });
  if (!actions.length) throw new (Error as any)('lib/wallet::pushTransaction:', { err: "[actions] is empty" });

  // handle different wallet protocols
  if (walletProtocol == "anchor") return handleAnchor(actions, cosign, flash);
  else if (walletProtocol == "scatter") return handleScatter(actions, cosign, flash);
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
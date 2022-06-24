import * as anchor from "./anchor";
import * as scatter from "./scatter";
import * as storage from "./storage";
// import * as analytics from "./analytics";
import { Action } from "scatter-ts";
import { ABIDef, PermissionLevel, Signature, SignedTransaction, Transaction, PrivateKey, Serializer, Checksum256, PackedTransaction, ABI } from "anchor-link";

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

const PayAction: Action = {
      account: "test.sx",
      name: "pay",
      authorization: [ {actor: "test.sx", permission: "pay"}],
      data: {}
}

// The private key used to sign transactions for the resource provider
const PayPrivateKey = PrivateKey.from(
    '5J2JURhtkcgLezYzZzVBy3QMWPsQrvRXfHe8BRXy1DbADRJLZR4'
)


const PayAbi = ABI.from({
  version: 'eosio::abi/1.1',
  types: [],
  structs: [
      {
      name: 'pay',
      base: '',
      fields: []
      }
  ],
  actions: [
      {
          name: 'pay',
          type: 'pay',
          ricardian_contract: 'This action does nothing.'
      }
  ],
  tables: [],
  ricardian_clauses: [],
  variants: []
})


async function handleAnchor(actions: Action[]) {
  console.log('lib/wallet::handleAnchor', { actions });
  const session = await anchor.login();
  if (!session) return "";

  console.log('🦐', session, session.auth.toString())

  const info = await session.client.v1.chain.get_info();
  const header = info.getTransactionHeader(300) // 300 = seconds this cosigned transaction is valid for
  console.log('🐏', header)

  const abis = await Promise.all(actions.map(act => session.client.v1.chain.get_abi(act.account)))

  const trx = Transaction.from({
      ...header,
      actions: [
        PayAction,
        ... actions
      ]
    },
    [
      { contract: PayAction.account, abi: PayAbi as ABIDef },
      ...abis.map((abi: any) => ({ contract: abi.account_name, abi: abi.abi as ABIDef}))
    ]
  );
  console.log('🦖', trx)

  // sign trx with pay signature
  const paySignature = PayPrivateKey.signDigest(trx.signingDigest(Checksum256.from(session.chainId)))
  console.log('🥒', paySignature)

  // request signature from Anchor wallet without broadcasting
  const result = await session.transact({ transaction: trx }, { broadcast: false });
  console.log('🐞', result)

  // merge pay signature + user signature
  const signedTransaction = SignedTransaction.from({
      ...result.transaction,
      signatures: [
        ...result.signatures,
        paySignature,
      ]
  })

  console.log('🦂', JSON.stringify(signedTransaction.toJSON(), null, 2));

  // push on chain
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
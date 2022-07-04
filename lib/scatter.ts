import { ScatterJS, ScatterEOS, Action, ScatterAccount } from 'scatter-ts';
import { JsonRpc, Api } from 'eosjs';
import { EOSIO_RPC, EOSIO_CHAIN_ID, SCATTER_IDENTIFIER } from "./constants";
import { Transaction, TransactResult } from 'eosjs/dist/eosjs-api-interfaces';
import { PushTransactionArgs } from 'eosjs/dist/eosjs-rpc-interfaces';

ScatterJS.plugins(new ScatterEOS());
global.fetch = fetch;

const { host, protocol } = new URL(EOSIO_RPC);
export const network = ScatterJS.Network.fromJson({
    blockchain: 'eos',
    protocol: (protocol.replace(":", '') as "http"|"https"),
    host,
    port: protocol == "https:" ? 443 : 80,
    chainId: EOSIO_CHAIN_ID
});

export const rpc = new JsonRpc(network.fullhost(), {fetch});

export function getApi() {
  return ScatterJS.eos(network, Api, { rpc });
}

export async function transact(actions: Action[]) {
    console.log(`scatter::transact:actions: ${JSON.stringify(actions, null, 2)}`);
    const options = { blocksBehind: 3, expireSeconds: 30 };
    const api = getApi();

    return api.transact({ actions }, options);
}


export async function sign(transaction: Transaction) {
  console.log(`scatter::transact:actions: ${JSON.stringify(transaction, null, 2)}`);
  const api = getApi();
  // init ABIs, serialize trx
  const serializedTransaction = api.serializeTransaction(transaction);
  // const abis = await Promise.all(transaction.actions.map(async action => api.abiProvider.getRawAbi(action.account)));
  // get keys
  const requiredKeys = await api.signatureProvider.getAvailableKeys()
  const signArgs = {
    chainId: api.chainId,
    requiredKeys,
    serializedTransaction,
    abis: [],
  }

  console.log('🐍', signArgs)
  // sign trx

  const pushTransactionArgs = await api.signatureProvider.sign(signArgs)

  console.log('🐳', pushTransactionArgs)
  return pushTransactionArgs;
}


export async function push(transaction: PushTransactionArgs) {
  console.log(`scatter::push:transaction: ${JSON.stringify(transaction, null, 2)}`);
  const api = getApi();
  return await api.pushSignedTransaction(transaction) as TransactResult;
}

export async function connect() {
    const connected = await ScatterJS.connect(SCATTER_IDENTIFIER, { network, allowHttp: true });
    if (!connected) throw "Can't connect to Scatter";
    return connected;
}

export async function login() {
    console.log("scatter::login");
    await connect();
    const id = await ScatterJS.login();
    if (!id) throw "No Scatter ID";
    const account: ScatterAccount = ScatterJS.account('eos');
    if (!account) throw "No Scatter Account";
    return account;
};

export async function disconnect() {
  console.log("scatter::disconnect");
  if ( ScatterJS.scatter && ScatterJS.scatter.forgetIdentity ) {
    await ScatterJS.scatter.forgetIdentity();
  }
};

export async function getAccount() {
    const { name, authority, publicKey } = await login();
    return { actor: name, permission: authority, publicKey, authorization: `${name}@${authority}` };
}

export async function getChain() {
    const { blockchain, chainId } = await login();
    return { blockchain, chainId };
}
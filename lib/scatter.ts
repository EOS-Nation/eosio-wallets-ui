import { ScatterJS, ScatterEOS, Action } from 'scatter-ts';
import { JsonRpc, Api } from 'eosjs';
import { EOSIO_RPC, EOSIO_CHAIN_ID } from "./constants";
// import fetch from "isomorphic-fetch";

ScatterJS.plugins(new ScatterEOS());

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

export function connect() {
    const connected = ScatterJS.connect('pomelo.io', { network });
    if (!connected) throw "Can't connect to Scatter";
    return connected;
}

export async function login() {
    console.log("scatter::login");
    await connect();
    const id = await ScatterJS.login();
    if (!id) throw "No Scatter ID";
    const account = ScatterJS.account('eos');
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
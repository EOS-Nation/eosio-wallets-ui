import AnchorLink, { LinkSession } from 'anchor-link'
import AnchorLinkBrowserTransport from 'anchor-link-browser-transport'
import { EOSIO_RPC, EOSIO_CHAIN_ID, ANCHOR_FUEL_REFERRER, ANCHOR_IDENTIFIER } from './constants'

global.fetch = fetch;

export const link = new AnchorLink({
    transport: new AnchorLinkBrowserTransport({fuelReferrer: ANCHOR_FUEL_REFERRER}),
    chains: [
        {
            chainId: EOSIO_CHAIN_ID,
            nodeUrl: EOSIO_RPC,
        }
    ],
})

export async function getAccount() {
  console.log("anchor::getAccount");
  return sessionToAccount(await login());
}

export async function disconnect() {
  console.log("anchor::disconnect");
  try {
    await link.clearSessions(ANCHOR_IDENTIFIER);
  } catch (err) {
    console.log("anchor::disconnect", {err});
  }
};

function sessionToAccount( session: LinkSession | null ) {
  console.log("anchor::sessionToAccount");
  if ( !session ) return {};
  const { auth, publicKey } = session;
  const { actor, permission } = auth;
  return { actor: actor.toString(), permission: permission.toString(), publicKey: publicKey.toString(), authorization: auth.toString() }
}

export async function login() {
  console.log("anchor::login");
  const sessions = await link.listSessions(ANCHOR_IDENTIFIER);
  if (sessions.length) return await link.restoreSession(ANCHOR_IDENTIFIER);
  else return (await link.login(ANCHOR_IDENTIFIER)).session
}
import { PermissionLevel } from "eosjs/dist/eosjs-rpc-interfaces";
import { Action, } from "eosjs/dist/eosjs-serialize";

const COSIGN_REFERRER = 'eosiowallets'
const COSIGN_ENDPOINT = "https://edge.pomelo.io/api/cosign"
// const COSIGN_ENDPOINT = "http://localhost:8080/cosign"

export async function cosignTransactionBackend(actions: Action[], signer: PermissionLevel): Promise<{transaction: any, signatures: string[]} | undefined> {

  try {
    const resp = await fetch(COSIGN_ENDPOINT, {
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
          transaction: {
            actions
          },
          signer,
          referrer: COSIGN_REFERRER
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
    console.log(`cosignTransactionBackend(): Failed to fetch free cpu.`, err.message ?? err)
    return undefined;
  }
}


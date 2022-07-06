import * as eosio from "@greymass/eosio"
import { EOSIO_RPC_ENDPOINT } from "./constants"

const client = new eosio.APIClient({ url: EOSIO_RPC_ENDPOINT });

export function get_transaction( trx_id: string ) {
    return client.v1.history.get_transaction( trx_id, {excludeTraces: true} );
}

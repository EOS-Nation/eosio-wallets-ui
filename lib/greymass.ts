import * as eosio from "@greymass/eosio"
import { EOSIO_RPC } from "./constants"

const client = new eosio.APIClient({ url: EOSIO_RPC });

export function get_transaction( trx_id: string ) {
    return client.v1.history.get_transaction( trx_id, {excludeTraces: true} );
}

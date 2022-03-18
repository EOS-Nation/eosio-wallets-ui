import * as eosio from "@greymass/eosio"

const client = new eosio.APIClient({url: "https://eos.greymass.com"});

export function get_transaction( trx_id: string ) {
    return client.v1.history.get_transaction( trx_id );
}

// ( async () => {
//     console.log(get_transaction("499a0c4eab9279b07f8de24e8bdfd67b07480cdcda27e1bf108d77454fbfea1f"))
// })();

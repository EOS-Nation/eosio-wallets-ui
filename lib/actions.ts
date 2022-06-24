import { Action } from "scatter-ts"

export function ping(name: string ): Action {
    return {
        account: "pingpong.sx",
        name: "ping",
        authorization: [ {actor: name, permission: "active"} ],
        data: {
            name,
        }
    }
}

// Private key: 5J2JURhtkcgLezYzZzVBy3QMWPsQrvRXfHe8BRXy1DbADRJLZR4
// Public key: EOS6aGjvnF854ozi1GnNoGGHMKr7R5n5bAtHqszT2aTSufTyZZJxn

// dcleos set account permission test.sx pay EOS6aGjvnF854ozi1GnNoGGHMKr7R5n5bAtHqszT2aTSufTyZZJxn active
// dcleos set action permission test.sx test.sx pay pay



export function noop( ): Action {
    return {
        account: "greymassnoop",
        name: "noop",
        authorization: [ {actor: "greymassfuel", permission: "cosign"}],
        data: {}
    }
}

export function transfer(from: string, to: string, quantity: string, memo: string ): Action {
    return {
        account: "eosio.token",
        name: "transfer",
        authorization: [ {actor: from, permission: "active"} ],
        data: {
            from,
            to,
            quantity,
            memo,
        }
    }
}
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
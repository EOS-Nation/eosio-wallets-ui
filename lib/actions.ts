import { Action } from "scatter-ts"

// export function transfer(from: string, to: string, quantity: string, memo: string ): Action {
//     return {
//         account: "pingpong.sx",
//         name: "ping",
//         authorization: [ {actor: from, permission: "active"}],
//         data: {
//             name, from,
//         }
//     }
// }

export function transfer(from: string, to: string, quantity: string, memo: string ): Action {
    return {
        account: "eosio.token",
        name: "transfer",
        authorization: [ {actor: from, permission: "active"}],
        data: {
            from,
            to,
            quantity,
            memo,
        }
    }
}
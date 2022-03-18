import { Highlight } from './Highlight';
import { get_transaction } from "../lib/greymass"
import { useState } from "react"

function slice( str: string ) {
    if ( str.length <= 5 ) return str;
    return `${str.slice(0, 5)}...${str.slice(-5)}`
}

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(() => resolve(true), ms))
}

export function Transaction({ transaction_id } : { transaction_id: string | undefined }) {
    const [ confirmed, setConfirmed ] = useState<boolean>(false);
    if ( !transaction_id ) return <span>4. Approve Transfer</span>

    async function confirm_transaction( retry = 3 ) {
        console.log("Transaction::confirm_transaction: ", {transaction_id, retry});
        if ( retry <= 0 ) return;
        try {
            await timeout(500);
            await get_transaction( transaction_id || '' );
            setConfirmed(true);
        } catch (e) {
            console.error(e);
            confirm_transaction( retry - 1 );
        }
    }
    confirm_transaction();

    const url = 'https://bloks.io/transaction/' + transaction_id;
    let message = confirmed ? `🎉 Success ` : '🕗 Confirming... '
    return (
        <span>
            {message} <a target="_blank" href={ url }><Highlight str={ slice(transaction_id) } /></a>
        </span>
    )
}

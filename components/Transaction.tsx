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
    const [ fail, setFail ] = useState<boolean>(false);
    if ( !transaction_id ) return <span>4. Approve Transfer</span>

    async function confirm_transaction( retry = 0 ) {
        if ( confirmed || fail ) return;
        console.log("Transaction::confirm_transaction: ", {transaction_id, retry});
        if ( retry >= 10 ) {
            setFail(true);
            return;
        }
        try {
            await timeout(5000);
            await get_transaction( transaction_id || '' );
            setConfirmed(true);
        } catch (e) {
            console.error(e);
            confirm_transaction( retry + 1 );
        }
    }
    confirm_transaction();

    const url = 'https://bloks.io/transaction/' + transaction_id;
    let message = confirmed ? `🎉 Success! ` : '🕗 Confirming... '
    if ( fail ) message = '❌ Not broadcasted ';
    return (
        <span>
            {message} <a target="_blank" rel="noopener noreferrer" href={ url }><Highlight str={ slice(transaction_id) } /></a>
        </span>
    )
}

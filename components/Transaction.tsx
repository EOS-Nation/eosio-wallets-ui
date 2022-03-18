import { Highlight } from './Highlight';

function slice( str: string ) {
    if ( str.length <= 5 ) return str;
    return `${str.slice(0, 5)}...${str.slice(-5)}`
}

export function Transaction({ transaction_id } : { transaction_id: string | undefined }) {
    if ( !transaction_id ) return <span>4. Approve Transfer</span>
    const url = 'https://bloks.io/transaction/' + transaction_id;
    return (
        <span>
            🎉 Success <a target="_blank" href={ url }><Highlight str={ slice(transaction_id) } /></a>
        </span>
    )
}

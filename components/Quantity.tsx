import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as wallet from "../lib/wallet";
import { transfer, ping } from "../lib/actions";
import { useRouter } from 'next/router'

interface QuantityProps {
    setTransactionId: any,
    setQuantity: any,
    actor: string,
    quantity: string,
    cosign: boolean,
    protocol: "scatter" | "anchor" | undefined
    flash: (message: string, type: 'error'|'success'|'warning'|'info') => void | undefined,
}

export function Quantity({ setQuantity, setTransactionId, actor, quantity, cosign, protocol, flash } : QuantityProps ) {
    const router = useRouter();

    const handleClick = async () => {
        setQuantity(quantity);
        setTransactionId("");
        let action = transfer( actor, "pomelo", quantity, "donate to Pomelo 🍈 - EOS wallet demo app");
        if ( router.query.dev ) action = ping( actor );
        wallet.pushTransaction([ action ], protocol, cosign, flash )
        .then((trx: any) => {
            if(flash && trx.transaction_id != '') flash(`Successfully pushed the transaction!`, 'success')
            setTransactionId(trx.transaction_id);
        })
        .catch((err: any) => {
            if(flash) flash(`Failed to push transaction: ${err.message ?? err}`, 'error')
        })
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2><Image src={ "/eos.svg" } alt={ "EOS" } width={22} height={22} /> { quantity }</h2>
        </a>
    )
}

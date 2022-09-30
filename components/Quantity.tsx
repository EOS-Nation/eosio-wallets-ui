import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { transfer, ping } from "../lib/actions";
import { useRouter } from 'next/router'
import Wallet from "eosio-wallets";

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

        try {
            const { transaction_id } = await Wallet.pushTransaction([ action ], protocol, cosign, {retry_trx: true} )
            if (flash && transaction_id != '') flash(`Successfully pushed the transaction!`, 'success')
            setTransactionId(transaction_id);
        } catch (err: any) {
            if (flash) flash(`Transaction not pushed: ${err.message ?? err}`, 'error')
        }
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2><Image src={ "/eos.svg" } alt={ "EOS" } width={22} height={22} /> { quantity }</h2>
        </a>
    )
}

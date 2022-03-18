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
    protocol: "scatter" | "anchor" | undefined
}

export function Quantity({ setQuantity, setTransactionId, actor, quantity, protocol } : QuantityProps ) {
    const router = useRouter();

    const handleClick = async () => {
        setQuantity(quantity);
        setTransactionId("");
        let action = transfer( actor, "pomelo", quantity, "donate to Pomelo 🍈 - EOS wallet demo app");
        if ( router.query.dev ) action = ping( actor );
        const transaction_id = await wallet.pushTransaction([ action ], protocol );
        setTransactionId(transaction_id);
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2><Image src={ "/eos.svg" } alt={ "EOS" } width={22} height={22} /> { quantity }</h2>
        </a>
    )
}

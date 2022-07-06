import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Wallet from "eosio-wallets";

interface LoginProps {
    setProtocol: any,
    setActor: any,
    img: string,
    name: string,
    protocol?: "scatter" | "anchor"
}

export function Login({ setProtocol, setActor, img, name, protocol = "scatter" } : LoginProps ) {
    const handleClick = async () => {
        const actor = (await Wallet.login(protocol))?.actor || 'Error';
        if ( actor ) {
            setActor( () => actor );
            setProtocol( () => protocol );
        }
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2><Image src={ img } alt={ name } width={22} height={22} /> { name }</h2>
        </a>
    )
}

export function Logout({ setActor, setProtocol }: { setActor: any, setProtocol: any }) {
    const handleClick = async () => {
        await Wallet.logout();
        setActor("");
        setProtocol("");
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2>Logout</h2>
        </a>
    )
}

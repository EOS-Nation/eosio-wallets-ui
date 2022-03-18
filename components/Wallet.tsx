import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as anchor from "../lib/anchor";
import * as scatter from "../lib/scatter";

export function Login({ setActor, img, name, protocol = "scatter" } : { setActor: any, img: string, name: string, protocol?: "scatter" | "anchor" }) {
    const handleClick = async () => {
        let actor = '';
        if ( protocol == "scatter" ) actor = (await scatter.login()).name;
        if ( protocol == "anchor" ) actor = (await anchor.login())?.auth.actor.toString() || '';
        setActor( () => actor );
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2><Image src={ img } alt={ name } width={22} height={22} /> { name }</h2>
        </a>
    )
}

export function Logout({ setActor }: { setActor: any }) {
    const handleClick = async () => {
        await scatter.disconnect();
        await anchor.disconnect();
        setActor("");
    }

    return (
        <a className={styles.card} onClick={ handleClick }>
            <h2>Logout</h2>
        </a>
    )
}
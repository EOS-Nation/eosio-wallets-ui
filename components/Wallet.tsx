import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as anchor from "../lib/anchor";
import * as scatter from "../lib/scatter";

export default function Wallet({ src, alt, protocol = "scatter" } : { src: string, alt: string, protocol?: "scatter" | "anchor" }) {
    const handleClick = async () => {
        try {
            if ( protocol == "scatter" ) await scatter.login();
            if ( protocol == "anchor" ) await anchor.login();
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <a className={styles.card} onClick={handleClick}>
            <h2><Image src={ src } alt={ alt } width={22} height={22} /> { alt }</h2>
        </a>
    )
}
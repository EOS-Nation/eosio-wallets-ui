import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Wallet({ src, alt } : { src: string, alt: string }) {
    return (
        <a href="https://nextjs.org/docs" className={styles.card}>
            <h2><Image src={ src } alt={ alt } width={22} height={22} /> { alt }</h2>
        </a>
    )
}
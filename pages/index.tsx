import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Wallet from '../components/Wallet'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>EOSIO Wallet</title>
        <meta name="description" content="EOSIO wallet integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          EOSIO Wallets
        </h1>

        <p className={styles.description}>
          Get started by selecting one of the wallets.
        </p>

        <div className={styles.grid}>

          <Wallet src="/anchor.svg" alt="Anchor" />
          <Wallet src="/tokenpocket.png" alt="TokenPocket" />
          <Wallet src="/wombat.png" alt="Wombat" />
          <Wallet src="/scatter.svg" alt="Scatter" />
          <Wallet src="/imtoken.png" alt="ImToken" />
          <Wallet src="/start.png" alt="Start" />

        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Image src="/EOSIO.svg" alt="EOSIO" width={24} height={24} color={"black"} /> EOSIO
        </a>
      </footer>
    </div>
  )
}

export default Home

import type { NextPage } from 'next'
import { useState } from "react"
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Login, Logout } from '../components/Wallet'

const Home: NextPage = () => {
  const [ actor, setActor ] = useState<string>("");

  let wallet = !actor ? (
    <div className={styles.grid}>
      <Login setActor={ setActor } img="/anchor.svg" name="Anchor" protocol={"anchor"} />
      <Login setActor={ setActor } img="/tokenpocket.png" name="TokenPocket" />
      <Login setActor={ setActor } img="/wombat.png" name="Wombat" />
      <Login setActor={ setActor } img="/scatter.svg" name="Scatter" />
      <Login setActor={ setActor } img="/imtoken.png" name="ImToken" />
      <Login setActor={ setActor } img="/start.png" name="Start" />
    </div>
  ) : '';

  let logout = actor ? (
    <div className={styles.grid}>
      <Logout setActor={ setActor } />
    </div>
  ) : '';

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
          1. Select wallet { actor ? `(${ actor })` : ''}<br/>
          2. Select amount<br/>
          3. Push transaction
        </p>
        { wallet }
        { logout }
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

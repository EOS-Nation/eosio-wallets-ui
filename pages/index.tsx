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
      <Login setActor={ setActor } img="/wombat.png" name="Wombat" />
      <Login setActor={ setActor } img="/tokenpocket.png" name="TP" />
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
        <title>EOS Wallets</title>
        <meta name="description" content="EOS wallets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          EOS Wallets
        </h1>
        <p className={styles.description}>
          1. Select wallet { actor ? <span className={styles.actor}>{ actor }</span> : ''}<br/>
          2. Select amount<br/>
          3. Push transaction
        </p>
        { wallet }
        { logout }
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/dotGems/eosio-wallets"
          target="_blank"
          rel="noopener noreferrer"
        >
          Source code . <Image src="/github.svg" alt="GitHub" width={24} height={24} />
        </a>
      </footer>
    </div>
  )
}

export default Home

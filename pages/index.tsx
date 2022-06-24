import type { NextPage } from 'next'
import { useState } from "react"
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Login, Logout } from '../components/Wallet'
import { Quantity } from '../components/Quantity'
import { Transaction } from "../components/Transaction";
import { Highlight } from "../components/Highlight";

const Home: NextPage = () => {
  const [ actor, setActor ] = useState<string>("");
  const [ transaction_id, setTransactionId ] = useState<string>();
  const [ protocol, setProtocol ] = useState<"scatter"|"anchor">();
  const [ quantity, setQuantity ] = useState<string>("");

  const wallets = !actor ? (
    <div className={styles.grid}>
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/anchor.svg" name="Anchor" protocol={"anchor"} />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/wombat.png" name="Wombat" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/tokenpocket.png" name="TP" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/scatter.svg" name="Scatter" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/imtoken.png" name="ImToken" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/start.png" name="Start" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/metahub.png" name="Metahub" />
    </div>
  ) : '';

  const quantities = actor ? (
    <div className={styles.grid}>
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "1.0000 EOS" } actor={ actor } protocol={ protocol } />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.5000 EOS" } actor={ actor } protocol={ protocol } />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.2500 EOS" } actor={ actor } protocol={ protocol } />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.1000 EOS" } actor={ actor } protocol={ protocol } />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.0500 EOS" } actor={ actor } protocol={ protocol } />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.0001 EOS" } actor={ actor } protocol={ protocol } />
    </div>
  ) : '';

  const logout = actor ? (
    <div className={styles.grid}>
      <Logout setProtocol={ setProtocol } setActor={ setActor } />
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
          { protocol ? "✅" : '1. Select' } Wallet <Highlight str={ protocol } /><br/>
          { actor ? "✅" : '2. Login' } Account <Highlight str={ actor } /><br/>
          { actor && quantity ? "✅" : '3. Select' } Quantity <Highlight str={ actor ? quantity : "" } /><br/>
          <Transaction transaction_id={ transaction_id } />
        </p>
        { wallets }
        { quantities }
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

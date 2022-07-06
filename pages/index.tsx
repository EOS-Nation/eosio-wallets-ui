import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Main } from "../components/Main"
import { SnackbarProvider } from 'notistack'

const Home: NextPage = () => {


  return (
    <div className={styles.container}>
      <Head>
        <title>EOS Wallets</title>
        <meta name="description" content="EOS wallets" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={5000}
      >
        <Main/>
      </SnackbarProvider>

      <footer className={styles.footer}>
        <a
          href="https://github.com/dotGems/eosio-wallets-ui"
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

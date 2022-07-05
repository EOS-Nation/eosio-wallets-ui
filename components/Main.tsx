import { useEffect, useState } from "react"
import styles from '../styles/Home.module.css'
import { Login, Logout } from './Wallet'
import { Quantity } from './Quantity'
import { Transaction } from "./Transaction";
import { Highlight } from "./Highlight";
import { useSnackbar } from "notistack";
import { configWallet } from "eosio-wallets";
import { EOSIO_RPC_ENDPOINT, EOSIO_CHAIN_ID, IDENTIFIER, COSIGN_ENDPOINT, COSIGN_REFERRER } from '../lib/constants';

export function Main() {
  const [ actor, setActor ] = useState<string>("");
  const [ transaction_id, setTransactionId ] = useState<string>();
  const [ protocol, setProtocol ] = useState<"scatter"|"anchor">();
  const [ quantity, setQuantity ] = useState<string>("");
  const [ cosign, setCosign ] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() =>
    configWallet({
      rpcEndpoint: EOSIO_RPC_ENDPOINT,
      chainId: EOSIO_CHAIN_ID,
      appId: IDENTIFIER,
      cosignEndpoint: COSIGN_ENDPOINT,
      cosignReferrer: COSIGN_REFERRER
    })
  );

  const wallets = !actor ? (
    <div className={styles.grid}>
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/anchor.svg" name="Anchor" protocol={"anchor"} />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/wombat.png" name="Wombat" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/tokenpocket.png" name="TP" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/scatter.svg" name="Scatter" />
      {/* <Login setProtocol={ setProtocol } setActor={ setActor } img="/imtoken.png" name="ImToken" /> */}
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/start.png" name="Start" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/metahub.png" name="Metahub" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/math.png" name="Math" />
      <Login setProtocol={ setProtocol } setActor={ setActor } img="/leaf.png" name="Leaf" />
    </div>
  ) : '';

  const FlashMessage = (message: string, type: 'error'|'success'|'warning'|'info') => {
    enqueueSnackbar(message, { variant: type });
  }

  const quantities = actor ? (
    <div className={styles.grid}>
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "1.0000 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage}/>
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.5000 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage} />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.2500 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage} />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.1000 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage} />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.0500 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage} />
      <Quantity setQuantity={ setQuantity } setTransactionId={ setTransactionId } quantity={ "0.0001 EOS" } actor={ actor } protocol={ protocol } cosign={ cosign } flash={FlashMessage} />
    </div>
  ) : '';

  const logout = actor ? (
    <div className={styles.grid}>
      <Logout setProtocol={ setProtocol } setActor={ setActor } />
    </div>
  ) : '';


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          EOS Wallets
        </h1>
        <p className={styles.description}>
          { protocol ? "✅" : '1. Select' } Wallet <Highlight str={ protocol } /><br/>
          { actor ? "✅" : '2. Login' } Account <Highlight str={ actor } /><br/>
          { actor && quantity ? "✅" : '3. Select' } Quantity <Highlight str={ actor ? quantity : "" } /><br/>
          <Transaction transaction_id={ transaction_id } /><br/><br/>
          <label>
            <input
              type="checkbox"
              checked={ cosign }
              onChange={ () => setCosign(!cosign) }
            /> Cosign
          </label>
        </p>
        { wallets }
        { quantities }
        { logout }
      </main>
    </div>
  )
}

export default Main

import styles from '../styles/Home.module.css'

export const Highlight = ( { str }: { str: string | undefined } ) => <span className={styles.highlight}>{ str }</span>
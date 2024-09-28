import styles from '../styles/Home.module.css'
import Image from 'next/image'

const SponsorContactCell = (props) => {
    
    const sponsor = props.sponsor
    
    return (
        <div className={styles.sponsorContactCell}>
            <a className={styles.userEquityCellName}>{`${sponsor.firstName} ${sponsor.lastName}`}</a>
            <a className={styles.userEquityCellEquity}>{sponsor.email}</a>
            <button className={styles.userEquityCellChatButton} onClick={() => props.contact()}>Contact</button>
        </div>
    )
}

export default SponsorContactCell
import styles from '../styles/Home.module.css'
import Image from 'next/image'


const InvestorActionButton = (props) => {

    return (
        <div className={styles.investorActionButtonContainer}>
            <div className={styles.cornerRedDot} />
            <button className={styles.adminControlButton} onClick={() => props.onClick()}>{props.title}</button>
        </div>
    )
    
}

export default InvestorActionButton
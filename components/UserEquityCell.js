import styles from '../styles/Home.module.css'
import Image from 'next/image'
import calculatePercentage from '../functions/calculatePercentage'

const UserEquityCell = (props) => {
    
    const investor = props.investor
    
    return (
        <div className={styles.dealDetailCell}>
            <Image className={styles.userEqutyCellImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='user profile pic' src={investor.profilePic} height={60} width={60} />
            <a className={styles.userEquityCellName}>{investor.name}</a>
            <a className={styles.userEquityCellEquity}>{calculatePercentage(investor.investmentAmount, investor.totalRaise)}</a>
            <a className={styles.userEquityCellEquity}>{investor.investmentAmount}</a>
            <a className={styles.userEquityCellEquity}>{investor.email}</a>
            <a className={styles.userEquityCellEquity}>{investor.phoneNumber}</a>
        </div>
    )
}

export default UserEquityCell
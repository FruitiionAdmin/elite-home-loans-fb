import styles from '../styles/Home.module.css'
import getCurrentDateString from '../functions/getCurrentDateString'

const DealAdminDistributionCell = (props) => {
    
    const distribution = props.distribution
    
    return (
        <div className={styles.dealDetailCell}>
            <a className={styles.dealAdminDistributionAmount}>{distribution.amount}</a>
            <a className={styles.dealAdminDistributionDate}>{getCurrentDateString(distribution.timestamp)}</a>
            <a className={styles.dealAdminDistributionMemo}>{distribution.memo}</a>
        </div>
    )
}

export default DealAdminDistributionCell
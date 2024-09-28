import styles from '../styles/Home.module.css'
import Image from 'next/image'
import getCurrentDateString from '../functions/getCurrentDateString'

const DealDetailReportsCell = (props) => {
    
    const document = props.document
    
    return (
        <div className={styles.dealDetailCell} onClick={() => props.viewDocument()}>
            <Image className={styles.userEquityCellImage} alt='pdf icon' src='/pdfIcon.svg' height={60} width={60} />
            <a className={styles.userEquityCellName}>{document.name}</a>
            <a className={styles.dealAdminDistributionDate}>{getCurrentDateString(document.timestamp)}</a>
            <a className={styles.dealAdminDistributionMemo}>{document.memo}</a>
        </div>
    )
}

export default DealDetailReportsCell
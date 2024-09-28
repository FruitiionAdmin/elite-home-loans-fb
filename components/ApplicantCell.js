import styles from '../styles/Home.module.css'
import Image from 'next/image'
import calculatePercentage from '../functions/calculatePercentage'

const ApplicantCell = (props) => {
    
    const applicant = props.applicant
    
    return (
        <div className={styles.dealDetailCell}>
            <Image className={styles.userEqutyCellImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='user profile pic' src={applicant.profilePic} height={60} width={60} />
            <a className={styles.userEquityCellName}>{applicant.name}</a>
            <a className={styles.userEquityCellEquity}>{calculatePercentage(applicant.investmentAmount, applicant.totalRaise)}</a>
            <a className={styles.userEquityCellEquity}>{applicant.investmentAmount}</a>
            <a className={styles.userEquityCellEquity}>{applicant.status}</a>
            <a className={styles.userEquityCellEquity}>{applicant.email}</a>
            <a className={styles.userEquityCellEquity}>{applicant.phoneNumber}</a>
            <button hidden={applicant.status != "Pending"} className={styles.applicantReviewButton} onClick={() => props.reviewApp()}>Review App</button>
            <button hidden={applicant.status != "Documents Submitted"} className={styles.applicantReviewButton} onClick={() => props.reviewDocs()}>Review Docs</button>
            <button hidden={applicant.status != "Payment Sent"} className={styles.applicantReviewButton} onClick={() => props.paymentReceived()}>Payment Received</button>
            <div hidden={applicant.status == "Pending" || applicant.status == "Documents Submitted" || applicant.status == "Payment Sent"} className={styles.applicantReviewButtonSpacer} />
        </div>
    )
}

export default ApplicantCell
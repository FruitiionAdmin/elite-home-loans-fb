import styles from '../styles/Home.module.css'
import ApplicantCell from './ApplicantCell'

const ApplicantTable = (props) => {

    const applicants = props.applicants

const userRows = applicants.map( (applicant, index) => {


    return (
        <ApplicantCell key={index} applicant={applicant} reviewDocs={() => props.reviewDocs(index)} reviewApp={() => props.reviewApp(index)} paymentReceived={() => props.paymentReceived(index)}/>
    )
})

    return (
        <div className={styles.adminTableContaier}>
            <div className={styles.dealDetailCell}>
                <div className={styles.applicantCellSpacer}/>
                <a className={styles.userEquityCellName}>Name</a>
                <a className={styles.userEquityCellEquity}>Equity</a>
                <a className={styles.userEquityCellEquity}>Amount</a>
                <a className={styles.userEquityCellEquity}>Status</a>
                <a className={styles.userEquityCellEquity}>Email</a>
                <a className={styles.userEquityCellEquity}>Phone</a>
                <div className={styles.applicantReviewButtonSpacer} />
            </div>
            {userRows}
        </div>
    )
    
}

export default ApplicantTable
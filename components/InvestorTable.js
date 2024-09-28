import styles from '../styles/Home.module.css'
import InvestorCell from './InvestorCell'

const InvestorTable = (props) => {

    const investors = props.investors

const userRows = investors.map( (investor, index) => {


    return (
        <InvestorCell key={index} investor={investor} reviewDocs={() => props.reviewDocs(index)} review={() => props.review(index)} paymentReceived={() => props.paymentReceived(index)}/>
    )
})

    return (
        <div className={styles.userManagmentTableContainer}>
            <div className={styles.userManagementCell}>
                <a className={styles.userMangementCellName}>Name</a>
                <a className={styles.userMangementCellName}>Email</a>
                <a className={styles.userMangementCellName}>Status</a>
                <div className={styles.applicantReviewButtonSpacer} />
            </div>
            {userRows}
        </div>
    )
    
}

export default InvestorTable
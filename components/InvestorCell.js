import styles from '../styles/Home.module.css'
import Image from 'next/image'

const InvestorCell = (props) => {
    
    const investor = props.investor
    
    return (
        <div className={styles.userManagementCell}>
            <a className={styles.userMangementCellInfo}>{investor.status != "Invited" ? `${investor.firstName} ${investor.lastName}`: `${investor.invitationName}`}</a>
            <a className={styles.userMangementCellInfo}>{investor.email}</a>
            <a className={styles.userMangementCellInfo}>{investor.status}</a>
            {
                investor.status != "Invited" ?
                    <button className={styles.userManagementReviewButton} onClick={() => props.review()}>Review</button>:
                    <div className={styles.applicantReviewButtonSpacer} />
            }
            
        </div>
        
    )
}

export default InvestorCell
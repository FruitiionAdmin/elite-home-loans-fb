import styles from '../styles/Home.module.css'
import Image from 'next/image'

const SponsorCell = (props) => {
    
    const sponsor = props.sponsor
    
    return (
        <div className={styles.userManagementCell}>
            <a className={styles.userMangementCellInfo}>{sponsor.status != "Invited" ? `${sponsor.firstName} ${sponsor.lastName}`: `${sponsor.invitationName}`}</a>
            <a className={styles.userMangementCellInfo}>{sponsor.email}</a>
            <a className={styles.userMangementCellInfo}>{sponsor.status}</a>
            {
                sponsor.status != "Invited" ?
                    <button className={styles.userManagementReviewButton} onClick={() => props.review()}>Review</button>:
                    <div className={styles.applicantReviewButtonSpacer} />
            }
        </div>
        
    )
}

export default SponsorCell
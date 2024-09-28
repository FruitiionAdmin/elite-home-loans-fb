import styles from '../styles/Home.module.css'
import SponsorCell from './SponsorCell'

const SponsorTable = (props) => {

    const sponsors = props.sponsors

const userRows = sponsors.map( (sponsor, index) => {


    return (
        <SponsorCell key={index} sponsor={sponsor} review={() => props.review(index)}/>
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

export default SponsorTable
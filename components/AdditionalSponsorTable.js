import styles from '../styles/Home.module.css'
import ApplicantCell from './ApplicantCell'

const AdditionalSponsorsTable = (props) => {

    const sponsors = props.sponsors

    const sponsorRows = sponsors.map( (sponsor, index) => {


        return (
            <div className={styles.additionalSponsorCell} key={index}>
                <a className={styles.userEquityCellName}>{sponsor[0]}</a>
                <a className={styles.userEquityCellName}>{sponsor[1]}</a>
                <button className={styles.applicantRejectButton} onClick={() => props.removeSponsor(index)}>-</button>
            </div>
        )
    })

    return (
        <div>
            {sponsorRows}
        </div>
    )
    
}

export default AdditionalSponsorsTable
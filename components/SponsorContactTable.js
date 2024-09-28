import styles from '../styles/Home.module.css'
import SponsorContactCell from './SponsorContactCell'

const SponsorContactTable = (props) => {

    const sponsors = props.sponsors

const sponsorRows = sponsors.map( (sponsor, index) => {


    return (
        <SponsorContactCell key={index} sponsor={sponsor} contact={() => props.contact()} />
    )
})

    return (
        <div className={styles.sponsorContactTable}>
            {sponsorRows}
        </div>
    )
    
}

export default SponsorContactTable
import styles from '../styles/Home.module.css'
import OfferingsCard from './OfferingsCard'
import SampleCard from './SampleCard'

const OfferingsTable = (props) => {

    const items = props.items

    const itemCards = items.map( (item, index) => {

        return (
            <OfferingsCard key={index} item={item}/>
        )
    })


    return (
        <div className={styles.offeringsTable}>
            <div className={styles.feedTable}>
                {itemCards}
                <br />
            </div>
            <br />
        </div>
    )
    
}

export default OfferingsTable
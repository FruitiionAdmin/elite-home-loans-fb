import styles from '../styles/Home.module.css'
import Image from 'next/image'
import DealsCard from './DealsCard'
const DealsTable = (props) => {

    const items = props.items

    const itemCards = items.map( (item, index) => {

        return (
            <DealsCard key={index} item={item}/>
        )
    })

    return (
        <div className={styles.feedTable}>
            {itemCards}
        </div>
    )
    
}

export default DealsTable
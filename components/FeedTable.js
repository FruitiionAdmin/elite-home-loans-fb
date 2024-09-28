import styles from '../styles/Home.module.css'
import Image from 'next/image'
import FeedCard from './FeedCard'

const FeedTable = (props) => {

    const items = props.items

    const itemCards = items.map( (item, index) => {

        return (
            <FeedCard key={index} item={item}/>
        )
    })

    return (
        <div className={styles.feedTable}>
            {itemCards}
        </div>
    )
    
}

export default FeedTable
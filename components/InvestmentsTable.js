import styles from '../styles/Home.module.css'
import Image from 'next/image'
import InvestmentsCard from './InvestmentsCard'

const InvestmentsTable = (props) => {

    const investments = props.investments

    const itemCards = investments.map( (investment, index) => {

        return (
            <InvestmentsCard key={index} investment={investment}/>
        )
    })

    return (
        <div className={styles.feedTable}>
            {itemCards}
        </div>
    )
    
}

export default InvestmentsTable
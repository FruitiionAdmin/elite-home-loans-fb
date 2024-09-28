import styles from '../styles/Home.module.css'
import DealDetailDocumentRow from './DealDetailDocumentCell'
import DealAdminDistributionCell from './DealAdminDistributionsCell'

const DealAdminDistributionTable = (props) => {

    const distributions = props.distributions

const distributionRows = distributions.map( (distribution, index) => {


    return (
        <DealAdminDistributionCell key={index} distribution={distribution}/>
    )
})

    return (
        <div className={styles.adminTableContaier}>
            {distributionRows}
        </div>
    )
    
}

export default DealAdminDistributionTable
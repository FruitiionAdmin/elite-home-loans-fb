import styles from '../styles/Home.module.css'
import DealDetailReportsCell from './DealDetailReportsCell'

const DealDetailReportsTable = (props) => {

    const documents = props.documents

    const documentRows = documents.map( (document, index) => {


        return (
            <DealDetailReportsCell key={index} document={document} viewDocument={() => props.viewDocument(index)}/>
        )
    })

    return (
        <div className={styles.adminTableContaier}>
            {documentRows}
        </div>
    )
    
}

export default DealDetailReportsTable
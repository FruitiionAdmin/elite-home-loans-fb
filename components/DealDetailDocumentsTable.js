import styles from '../styles/Home.module.css'
import DealDetailDocumentRow from './DealDetailDocumentCell'

const DealDetailDocumentsTable = (props) => {

    const documents = props.documents

    const documentRows = documents.map( (document, index) => {


        return (
            <DealDetailDocumentRow key={index} document={document} viewDocument={() => props.viewDocument(index)}/>
        )
    })

    return (
        <div className={styles.adminTableContaier}>
            {documentRows}
        </div>
    )
    
}

export default DealDetailDocumentsTable
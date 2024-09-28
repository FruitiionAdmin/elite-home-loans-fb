import styles from '../styles/Home.module.css'
import MiniUploadDocumentsTable from './MiniUploadDocumentsTable'
const InvestmentAdminUploadDocuments = (props) => {
    
    const documents = props.documents
    
    return (
        <div className={styles.modalContainer}>
        <div className={styles.investmentAdminUploadDocuments}>
            <div className={styles.modalCloseRow}>
                <a className={styles.modalClose} onClick={() => props.close()}>X</a>
            </div>
            <div className={styles.modalContent}>
                <div className={styles.modalColumn}>
                    <a className={styles.errorMessage}>{props.errorMessage}</a>
                    <br />
                    <label className={styles.registraionInputFileContainer}>
                        <a className={styles.registrationFileDisplay}>+ Upload Documents</a>
                        <input multiple type='file' accept='application/pdf' className={styles.registrationFile}  id='investmentDocs' onChange={(event) => props.onDocumentChange(event)}/>
                    </label>
                    <p className={styles.uploadDocsDirections}>Please download and sign the documents and then upload the documents here for the Sponsor to review.</p>
                    <MiniUploadDocumentsTable documents={documents} removeDocument={(index) => props.removeDocument(index) }/>
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.applicantReviewAcceptButton} onClick={() => props.submitDocuments()}>Submit Documents</button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default InvestmentAdminUploadDocuments
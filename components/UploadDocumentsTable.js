import styles from '../styles/Home.module.css'
import ApplicantCell from './ApplicantCell'
import Image from 'next/image'

const UploadDocumentsTable = (props) => {

    const documents = props.documents

    const documentRows = documents.map( (document, index) => {


        return (
            <div className={styles.flowCellUploadReviewCell} key={index}>
                <Image className={styles.userEquityCellImage} alt='pdf icon' src='/pdfIcon.svg' height={60} width={60} />
                <a className={styles.userEquityCellName}>{document.name}</a>
                <button className={styles.applicantRejectButton} onClick={() => props.removeDocument(index)}>-</button>
            </div>
        )
    })

    return (
        <div className={styles.uploadDocumentsTableNewDeal}>
            {documentRows.length != 0 ? 
                documentRows:
                <Image className={styles.fileUploadPreview} alt='image review' src='/pdfIcon.svg' height={50} width={50} />
            }
        </div>
    )
    
}

export default UploadDocumentsTable
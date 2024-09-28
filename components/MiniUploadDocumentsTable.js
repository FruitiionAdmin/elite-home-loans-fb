import styles from '../styles/Home.module.css'
import ApplicantCell from './ApplicantCell'
import Image from 'next/image'

const MiniUploadDocumentsTable = (props) => {

    const documents = props.documents

    const documentRows = documents.map( (document, index) => {


        return (
            <div className={styles.miniDealDetailCell} key={index}>
                <Image className={styles.userEquityCellImage} alt='pdf icon' src='/pdfIcon.svg' height={50} width={50} />
                <a className={styles.userEquityCellName}>{document.name}</a>
                <button className={styles.applicantRejectButton} onClick={() => props.removeDocument(index)}>Remove</button>
            </div>
        )
    })

    return (
        <div className={styles.miniUploadDocumentsTable}>
            {documentRows.length != 0 ? 
                documentRows:
                <Image className={styles.fileUploadPreview} alt='image review' src='/pdfIcon.svg' height={50} width={50} />
            }
        </div>
    )
    
}

export default MiniUploadDocumentsTable
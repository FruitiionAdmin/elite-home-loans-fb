import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'






const DealAdminDocumentReview = (props) => {


    const applicant = props.applicant

    const documentCells = applicant.documents.map( (document,index) => {
        return (
            <div className={styles.documentReviewCell} key={index}>
                <Image className={styles.equityManagementInvestorPic} alt='pdf icon' height={100} width={100} src='/pdfIcon.svg'/>
                <a className={styles.documentReviewDocTitle}>{document.name}</a>
                <button className={styles.applicantReviewButton} onClick={()=> props.viewDoc(document.url)}>View</button>
            </div>
        )
    })

    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminDocumentReview}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.dealAdminReviewDocsTable}>
                        {documentCells}
                    </div>
                    
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.registrationPreviousButton} onClick={() => props.documentDecision("Rejected", applicant)}>Reject</button>
                    <button className={styles.registrationPreviousButton} onClick={() => props.documentDecision("Awaiting Documents", applicant)}>Resubmit</button>
                    <button className={styles.registrationProgressButton} onClick={() => props.documentDecision("Awaiting Payment", applicant)}>Accept</button>
                </div>
            </div>

        </div>
    )
}

export default DealAdminDocumentReview
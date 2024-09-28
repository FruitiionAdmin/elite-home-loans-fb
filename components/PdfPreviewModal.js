import styles from '../styles/Home.module.css'
import Image from 'next/image'

const PdfPreviewModal = (props) => {
    const url = props.url
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminApplicantReview}>
                <iframe className={styles.pdf} src={url} alt="w9 preview"/>
                <div className={styles.modalBottomButtonContainer}>
                    <button className={styles.adminControlButton} onClick={() => props.close()}>CLOSE</button>
                </div>
            </div>
        </div>
    )
}


export default PdfPreviewModal
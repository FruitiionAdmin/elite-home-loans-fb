import styles from '../styles/Home.module.css'
import Image from 'next/image'





const PreviewPhoto = (props) => {

const url = props.url

    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminMediaMangement}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <Image className={styles.previewPhoto} alt='preview Image' height={500} width={500} src={url} />
                </div>
            </div>

        </div>
    )
}

export default PreviewPhoto
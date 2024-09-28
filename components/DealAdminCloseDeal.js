import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'
import RegistraionInputField from './RegistrationInputField'






const DealAdminCloseDeal = (props) => {




    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminCloseDeal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.closeDealHeader}>Are you sure you want to close this deal?</a>
                    </div>
                    <div className={styles.modalRow}>
                        <p className={styles.closeDealInstruction}>If there are any reports that need to be uploaded or remaining distributionsto be made, please do so before closing the deal.</p>
                    </div>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea className={styles.registrationTextArea} placeholder='Closing message to investors (optional)' value={props.value} onChange={(event) => props.onChange(event)}/>
                    </div>
                    <div className={styles.modalButtonRow}>
                        <button className={styles.registrationProgressButton} onClick={ () => props.closeDeal()}>Close Deal</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DealAdminCloseDeal
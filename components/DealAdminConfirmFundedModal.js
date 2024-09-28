import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'
import RegistraionInputField from './RegistrationInputField'






const DealAdminConfirmFunded = (props) => {
    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminCloseDeal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.closeDealHeader}>Are you sure you want to set the status to Funded?</a>
                    </div>
                    <div className={styles.modalRow}>
                        <p className={styles.closeDealInstruction}>This will stop potential investors from being able to invest. Are you sure you want to stop the raise?</p>
                    </div>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea className={styles.registrationTextArea} placeholder='Message to investors (optional)' value={props.value} onChange={(event) => props.onChange(event)}/>
                    </div>
                    <div className={styles.modalButtonRow}>
                        <button className={styles.registrationProgressButton} onClick={ () => props.funded()}>Funded</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DealAdminConfirmFunded
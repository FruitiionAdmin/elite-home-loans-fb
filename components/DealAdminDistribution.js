import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'
import RegistraionInputField from './RegistrationInputField'






const DealAdminDistribution = (props) => {




    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminDistribution}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalColumn}>
                        <div className={styles.registraionInputContainer}>
                            <input value={props.distributionAmount} className={styles.registrationInput} placeholder='Distribution Amount' onChange={(event) => props.onDistributionChange(event)}/>
                        </div>
                    </div>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea className={styles.registrationTextArea} placeholder='Distribution Memo (optional)' onChange={(event) => props.onDistributionMemoChange(event)} value={props.distributionMemo}/>
                    </div>
                    <button className={styles.registrationProgressButton} onClick={() => props.makeDistribution()}>Make Distribution</button>

                </div>
            </div>

        </div>
    )
}

export default DealAdminDistribution
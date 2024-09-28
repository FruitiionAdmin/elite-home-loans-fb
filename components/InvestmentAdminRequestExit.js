import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'
import RegistraionInputField from './RegistrationInputField'






const InvestmentAdminRequestExit = (props) => {




    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminCloseDeal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.closeDealHeader}>Are you sure you want to exit the deal early?</a>
                    </div>
                    <div className={styles.modalRow}>
                        <p className={styles.closeDealInstruction}>This is a request and exit terms are made at the discretion of the sponsor.</p>
                    </div>
                    <textarea className={styles.makeDistributionMemo} placeholder='Message to the sponsor.'/>
                    <div className={styles.modalButtonRow}>
                        <button className={styles.applicantReviewAcceptButton}>Request Exit</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default InvestmentAdminRequestExit
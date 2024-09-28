import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'
import RegistrationTextArea from './RegistrationTextArea'





const CompletionModal = (props) => {

    return (
        <div className={styles.modalContainer}>
            <div className={styles.completionModal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.inviteModalTitle}>{props.title}</a>
                    </div>
                    <br />
                    <div className={styles.modalRow}>
                        <p className={styles.completionMessage}>{props.message}</p>
                    </div>
                    <br />
                    <div className={styles.modalRow}>
                        <button className={styles.registrationProgressButton} onClick={() => props.close()}>OK</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default CompletionModal
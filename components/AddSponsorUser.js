import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'
import RegistrationTextArea from './RegistrationTextArea'





const AddSponsorModal = (props) => {

    return (
        <div className={styles.modalContainer}>
            <div className={styles.inviteUserModal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.inviteModalTitle}>Add Sponsor</a>
                    </div>
                    <RegistraionInputField value={props.name} placeholder="Sponsor Name" onChange={(event) => props.onNameChange(event)}/>
                    <RegistraionInputField value={props.email} placeholder="Sponsor Email" onChange={(event) => props.onEmailChange(event)}/>
                    <RegistrationTextArea placeholder="Message to the invitee (optional)" onChange={(event) => props.onMessageChange(event)} value={props.message}/>
                    <div className={styles.modalRow}>
                        <button className={styles.registrationProgressButton} onClick={() => props.submit()}>Invite</button>
                    </div>
                    <br />
                    <a className={styles.errorMessage}>{props.error}</a>
                </div>
            </div>

        </div>
    )
}

export default AddSponsorModal
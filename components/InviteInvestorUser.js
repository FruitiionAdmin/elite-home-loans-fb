import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'
import RegistrationTextArea from './RegistrationTextArea'





const InviteInvestorModal = (props) => {

    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminReport}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.inviteModalTitle}>Invite Investor</a>
                    </div>
                    <RegistraionInputField value={props.name} placeholder="Investor Name" onChange={(event) => props.onNameChange(event)}/>
                    <RegistraionInputField value={props.email} placeholder="Investor Email" onChange={(event) => props.onEmailChange(event)}/>
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

export default InviteInvestorModal
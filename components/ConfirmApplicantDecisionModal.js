import styles from '../styles/Home.module.css'

const ConfirmApplicantDecisionModal = (props) => {
    
    const {decision, applicant} = props.decisionInfo

    return (
        <div className={styles.modalContainer}>
        <div className={styles.investmentAdminMakePayment}>
            <div className={styles.modalCloseRow}>
                <a className={styles.modalClose} onClick={() => props.close()}>X</a>
            </div>
            <div className={styles.modalContent}>
                <div className={styles.modalColumn}>
                    <a className={styles.makePaymentAmount}>Application Decision Confirmation</a>
                    <p className={styles.makePaymentMessage}>Are you sure you want to {decision} this investor application?</p>
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.applicantReviewAcceptButton} onClick={() => props.decision(decision,applicant)}>{decision}</button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default ConfirmApplicantDecisionModal
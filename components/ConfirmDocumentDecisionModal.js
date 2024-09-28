import styles from '../styles/Home.module.css'

const ConfirmDocumentDecisionModal = (props) => {
    
    const {decision, applicant} = props.decisionInfo

    const generateDecisionText = () => {
        switch (decision) {
            case "Rejected":
                return "Reject"
            case "Awaiting Payment":
                return "Accept"
            case "Awaiting Documents":
                return "Resubmit"
        }
    }

    return (
        <div className={styles.modalContainer}>
        <div className={styles.investmentAdminMakePayment}>
            <div className={styles.modalCloseRow}>
                <a className={styles.modalClose} onClick={() => props.close()}>X</a>
            </div>
            <div className={styles.modalContent}>
                <div className={styles.modalColumn}>
                    <a className={styles.makePaymentAmount}>Documents Decision Confirmation</a>
                    <p className={styles.makePaymentMessage}>Are you sure you want to {decision == "Awaiting Documents" ? "have the investor " : null} {generateDecisionText()} the documents for this investment?</p>
                    <p className={styles.makePaymentMessage}>Please coordinate with the investor for payment using the information below.</p>
                    <p className={styles.makePaymentMessage}>{applicant.email}</p>
                    <p className={styles.makePaymentMessage}>{applicant.phoneNumber}</p>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea value={props.decisionComments} className={styles.registrationTextArea} placeholder='Message to the investor. If you want to have the investor resubmit their documents, you can clairify which particular ones here. (optional)' onChange={(event) => props.documentDecisionComments(event)}/>
                    </div>
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.applicantReviewAcceptButton} onClick={() => props.decision(decision,applicant)}>{generateDecisionText()}</button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default ConfirmDocumentDecisionModal
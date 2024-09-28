import styles from '../styles/Home.module.css'
import calculatePercentage from '../functions/calculatePercentage'

const ConfirmPaymentModal = (props) => {
    
    const {name, nickname, investmentAmount, totalRaise} = props.applicant

    return (
        <div className={styles.modalContainer}>
        <div className={styles.investmentAdminMakePayment}>
            <div className={styles.modalCloseRow}>
                <a className={styles.modalClose} onClick={() => props.close()}>X</a>
            </div>
            <div className={styles.modalContent}>
                <div className={styles.modalColumn}>
                    <a className={styles.makePaymentAmount}>Payment Received Confirmation</a>
                    <p className={styles.makePaymentMessage}>You are confirming you have received the payment from {name} for {calculatePercentage(investmentAmount, totalRaise)} equity in the {nickname} deal.</p>
                    <br />
                    <p className={styles.makePaymentMessage}>This will finalize the investment.</p>
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.applicantReviewAcceptButton} onClick={() => props.confirm(props.applicant)}>Confirm</button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default ConfirmPaymentModal
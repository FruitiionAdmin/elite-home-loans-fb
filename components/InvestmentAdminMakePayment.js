import styles from '../styles/Home.module.css'

const InvestmentAdminMakePayment = (props) => {
    
    
    return (
        <div className={styles.modalContainer}>
        <div className={styles.investmentAdminMakePayment}>
            <div className={styles.modalCloseRow}>
                <a className={styles.modalClose} onClick={() => props.close()}>X</a>
            </div>
            <div className={styles.modalContent}>
                <div className={styles.modalColumn}>
                    <a className={styles.makePaymentAmount}>Amount: {props.amount}</a>
                    <a className={styles.makePaymentEquity}>Equity: {props.equity}</a>
                    <p className={styles.makePaymentMessage}>The amount above has been paid to gain the equity also displayed above in the &quot;{props.nickname}&quot; offering. This will alert the sponsor that you have sent the payment. (By clicking &quot;Confirm&quot;, this is just sending a notification to the Sponsor and does not initiate any payment to the Sponsor.)</p>
                </div>
                <div className={styles.modalButtonRow}>
                    <button className={styles.applicantReviewAcceptButton} onClick={() => props.paymentSent()}>Confirm</button>
                </div>
            </div>
        </div>

    </div>
    )
}

export default InvestmentAdminMakePayment
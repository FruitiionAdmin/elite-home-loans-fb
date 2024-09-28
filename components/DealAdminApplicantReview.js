import styles from '../styles/Home.module.css'
import Image from 'next/image'
import RegistraionInputField from './RegistrationInputField'






const DealAdminApplicantReview = (props) => {


    const applicant = props.applicant

    const experienceString = () => {
        let exp = applicant.experience
        return exp.join(", ")
    }


    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminApplicantReview}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalRow}>
                    <Image className={styles.applicantReviewProfilePic} alt='applicant profile pic' src={applicant.profilePic} height={1000} width={1000} />
                    <a className={styles.applicantReviewName}>{applicant.name}</a>
                </div>
                <div className={styles.modalRow}>
                    <div className={styles.modalColumn}>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Networth:</strong> {applicant.networth}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Annual Income:</strong> {applicant.income}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Experience:</strong> {experienceString()}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Intended Investment Length:</strong> {applicant.investmentLength}</a>
                        
                        
                    </div>
                    <div className={styles.modalColumn}>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Email:</strong> {applicant.email}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Phone Number:</strong> {applicant.phoneNumber}</a>
                    </div>
                    
                </div>
                
                <div className={styles.modalRow}>
                <div className={styles.modalColumn}>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Min Investment:</strong> {props.minInvestment}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Max Investment:</strong> {props.maxInvestment}</a>
                    </div>
                    <div className={styles.modalColumn}>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Investment Amount:</strong> {applicant.investmentAmount}</a>
                        <a className={styles.applicantReviewGeneralInfo}><strong>Equity:</strong> {props.equity}</a>
                    </div>
                    <div className={styles.newEquityColumn}>
                        <div className={styles.applicantReviewNewEquityInputContainer}>
                            <RegistraionInputField value={props.adjustedInvestmentAmount} onChange={(event) => props.onAdjustedInvestmentAmountChange(event)} placeholder='Adjusted Amount (optional)'/>
                        </div>
                        <a className={styles.newEquityInfo}><strong>New Equity:</strong> {props.newEquity}</a>
                    </div>
                    

                </div>
                <div className={styles.modalRow}>
                    <button className={styles.applicantReviewViewIqsButton} onClick={() => props.viewIqs(applicant.iqs)}>View</button>
                    <a className={styles.applicantReviewIqs}>Investor Qualification Statement</a>
                </div>
                <div className={styles.modalColumn}>
                    <br />
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea value={props.decisionComments} className={styles.registrationTextArea} placeholder='Message to the investor. (optional)' onChange={(event) => props.onDecisionMessageChange(event)}/>
                    </div>
                    <br />
                </div>
                <br />
                <div className={styles.modalRow}>
                    <button className={styles.registrationPreviousButton} onClick={() => props.decision("Reject", applicant)}>Reject</button>
                    <button className={styles.registrationProgressButton} onClick={() => props.decision("Accept", applicant)}>Accept</button>
                </div>
            </div>
        </div>
    )
}

export default DealAdminApplicantReview
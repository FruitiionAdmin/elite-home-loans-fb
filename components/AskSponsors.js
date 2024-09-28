import { useState } from 'react'
import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'

const AskSponsors = (props) => {


    const emails = props.emails
    const newEmail = props.newEmail


    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealDetailShareDeal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <RegistraionInputField placeholder='Your email address?' value={props.returnEmail} onChange={(event) => props.onEmailChange(event.target.value)}/>
                    </div>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea className={styles.registrationTextArea} placeholder='What would you like to ask the sponsors?' onChange={(event) => props.onMessageChange(event.target.value)}/>
                    </div>
                    <div className={styles.modalButtonRow}>
                        <button className={styles.applicantReviewAcceptButton} onClick={() => props.sendEmail()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AskSponsors
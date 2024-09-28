import { useState } from 'react'
import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'

const ShareDeal = (props) => {


    const emails = props.emails
    const newEmail = props.newEmail


    const emailCells = emails.map(( email, index ) => {

        return (
            <div className={styles.shareEmailCell} key={index}>
                <a className={styles.shareEmailCellEmail}>{email}</a>
                <a className={styles.shareEmailCellDelete} onClick={() => props.removeEmail(index)}>X</a>
            </div>
        )
    })

    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealDetailShareDeal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <RegistraionInputField placeholder='Add an Email +' value={props.newEmail} onChange={(event) => props.onChange(event.target.value)}/>
                        <button className={styles.applicantReviewAcceptButton} onClick={() => props.addEmail()}>+</button>
                    </div>
                    <div className={styles.modalRow}>
                        <div className={styles.shareEmailTable}>
                            {
                                emailCells.length > 0 ?
                                emailCells:
                                <a className={styles.noEmailsText}>No emails added</a>
                            }
                        </div>
                    </div>
                    <div className={styles.modalButtonRow}>
                        <button className={styles.applicantReviewAcceptButton} onClick={() => props.sendShareEmail()}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ShareDeal
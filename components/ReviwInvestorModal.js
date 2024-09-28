import styles from '../styles/Home.module.css'
import Image from 'next/image'

const ReviewInvestorModal = (props) => {
    const investor = props.investor
    return (
        <div className={styles.modalContainer}>
            <div className={styles.reviewInvestorModal}>
                <div className={styles.modalRow}>
                <Image className={styles.modalProfileImage} height={175} width={175} src={investor.profilePicture}/>
                    <div className={styles.modalColumn}>
                        <a className={styles.reviewModalTitle}>{investor.firstName} {investor.middleInitial} {investor.lastName}</a>
                        <a className={styles.reviewModalSecondaryInfo}>{investor.email}</a>
                        <a className={styles.reviewModalSecondaryInfo}>{investor.phoneNumber}</a>
                        <a className={styles.reviewModalSecondaryInfo}>Status: {investor.status}</a>
                    </div>
                </div>
                <div className={styles.modalRow}>
                    <Image className={styles.idPhotos} height={250} width={250} src={investor.frontId}/>
                    <Image className={styles.idPhotos} height={250} width={250} src={investor.backId}/>
                </div>
                <div className={styles.modalRow}>
                    <button className={styles.viewW9Button} onClick={() => props.previewPdf()}>View W9</button>
                    <a className={styles.verificationCode}>{investor.selfCode}</a>
                </div>
                <textarea value={props.comment} onChange={(event) => props.commentsChange(event)} className={styles.modalMessage} placeholder='Message to applicant (optional)'/>
                <div className={styles.modalBottomButtonContainer}>
                    {
                        investor.status == "Pending" ?
                        <>
                            <button className={styles.acceptButton} onClick={() => props.activate()}>ACCEPT</button>
                            <button className={styles.rejectButton} onClick={() => props.reject()}>REJECT</button>
                        </>:
                        null
                    }
                    {
                        investor.status == "Active" ?
                        <>
                            <button className={styles.rejectButton} onClick={() => props.deactivate()}>Deactivate</button>
                        </>:
                        null
                    }
                    {
                        investor.status == "Inactive" || investor.status == "Rejected" ?
                        <>
                            <button className={styles.acceptButton} onClick={() => props.activate()}>Activate</button>
                        </>:
                        null
                    }
                    <button className={styles.cancelButton} onClick={() => props.cancel()}>CANCEL</button>
                </div>
            </div>
        </div>
    )
}


export default ReviewInvestorModal
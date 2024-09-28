import styles from '../styles/Home.module.css'
import RegistraionInputField from './RegistrationInputField'
import RegistrationTextArea from './RegistrationTextArea'
import Image from 'next/image'





const ReviewSponsorModal = (props) => {

    const sponsor = props.sponsor

    return (
        <div className={styles.modalContainer}>
            <div className={styles.userReviewModal}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <a className={styles.inviteModalTitle}>Sponsor Managment</a>
                    </div>
                    <div className={styles.modalRow}>
                        <Image src={sponsor.profilePic} width={100} height={100}/>
                        <div className={styles.userInfoContainer}>
                            <div className={styles.userInfoRow}>
                                <a className={styles.userReviewInfo}>{sponsor.firstName} {sponsor.lastName}</a>
                            </div>
                            <div className={styles.userInfoRow}>
                                <a className={styles.userReviewInfo}>{sponsor.email}</a>
                            </div>
                            <div className={styles.userInfoRow}>
                                <a className={styles.userReviewInfo}>{sponsor.phoneNumber}</a>
                            </div>
                            {
                                sponsor.superUser ?
                                    <div className={styles.userInfoRow}>
                                        <a className={styles.userReviewInfo}>Super User</a>
                                    </div>:
                                    null

                            }
                        </div>
                    </div>
                    <div className={styles.modalRow}>
                        <p className={styles.userReviewAbout}>
                            {sponsor.about}
                        </p>
                    </div>
                    <div className={styles.modalRow}>
                        {
                            sponsor.status == "Active" ?
                            <button className={styles.sponsorManagmentButton} onClick={() => props.deactivate()}>Deactivate</button>:
                            <button className={styles.sponsorManagmentButton} onClick={() => props.activate()}>Activate</button>
                        }
                        {
                            !sponsor.superUser ?
                            <button className={styles.sponsorManagmentButton} onClick={() => props.makeSuper()}>Super User</button>:
                            <button className={styles.sponsorManagmentButton} onClick={() => props.removeSuper()}>Remove Super User</button>
                        }
                        
                        
                    </div>
                    <a className={styles.errorMessage}>{props.error}</a>
                </div>
            </div>

        </div>
    )
}

export default ReviewSponsorModal
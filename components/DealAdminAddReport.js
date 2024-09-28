import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'
import RegistraionInputField from './RegistrationInputField'






const DealAdminAddReport = (props) => {




    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminReport}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.modalRow}>
                        <RegistraionInputField value={props.reportTitle} placeholder='Report Title' onChange={(event) => props.onReportTitleChange(event)}/>
                    </div>
                    <div className={styles.registraionTextAreaContainer}>
                        <textarea className={styles.registrationTextArea} placeholder='Report Memo (optional)' onChange={(event) => props.onChange(event)} value={props.value}/>
                    </div>
                    <iframe className={styles.pdf} src={props.report} alt="report preview"/>
                    <div className={styles.modalRow}>
                        <label className={styles.registraionInputFileContainer}>
                            <a className={styles.registrationFileDisplay}>Upload Report +</a>
                            <input type='file' accept='application/pdf' className={styles.registrationFile}  id='frontId' onChange={(event) => props.onReportChange(event)}/>
                        </label>
                    </div>
                    <div className={styles.modalRow}>
                        <button className={styles.registrationProgressButton} onClick={() => props.uploadReport()}>SAVE</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DealAdminAddReport
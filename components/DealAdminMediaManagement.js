import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'






const DealAdminMediaManagement = (props) => {


    const photos = props.photos

    const dealPhotos = photos.map( (photo,index) => {
        if ( photo != "") {
            return (
                <MediaManagementPhotoCell key={index} url={photo} delete={() => props.delete(index)}/>
            )
        }
        
    })

    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminMediaMangement}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.dealAdminMediaFirstRow}>
                        <label className={styles.dealAdminMediaMangementAddPhotoInput}>
                            <a className={styles.registrationFileDisplay}>Upload Photos +</a>
                            <input type='file' accept='image/*' className={styles.registrationFile} />
                        </label>
                        <button className={styles.saveMediaButton}>SAVE</button>
                    </div>
                    <div className={styles.dealAdminMediaManagementPhotoTable}>
                        {dealPhotos}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DealAdminMediaManagement
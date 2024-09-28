import styles from '../styles/Home.module.css'
import ApplicantCell from './ApplicantCell'
import Image from 'next/image'

const UploadImagesTable = (props) => {

    const images = props.images

    const imageRows = images.map( (image, index) => {


        return (
            <div className={styles.flowCellUploadReviewCell} key={index}>
                <Image className={styles.userEquityCellImage} alt='pdf icon' src={image} height={60} width={60} />
                <button className={styles.applicantRejectButton} onClick={() => props.removeImage(index)}>-</button>
            </div>
        )
    })

    return (
        <div className={styles.uploadDocumentsTable}>
            {imageRows.length != 0 ? 
                imageRows:
                <Image className={styles.fileUploadPreview} alt='image review' src='/folder.svg' height={50} width={50} />
            }
        </div>
    )
    
}

export default UploadImagesTable
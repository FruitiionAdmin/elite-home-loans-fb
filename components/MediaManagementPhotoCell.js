import styles from '../styles/Home.module.css'
import Image from 'next/image'


const MediaManagementPhotoCell = (props) => {
    let url = props.url
    return (
        <div className={styles.mediaManagementPhotoCell}>
            <a className={styles.mediaManagementPhotoCellClose} onClick={() => props.delete()}>X</a>
            <Image className={styles.mediaManagementImage} alt='photo preview' height={180} width={180} src={url}/>
        </div>
    )
}

export default MediaManagementPhotoCell
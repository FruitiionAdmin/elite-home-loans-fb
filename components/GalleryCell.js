import styles from '../styles/Home.module.css'
import Image from 'next/image'


const GalleryCell = (props) => {
    const url = props.url
    return (
        <div className={styles.galleryPhotoCell} onClick={() => props.preview()}>
            <Image className={styles.galleryImage} alt='photo preview' height={180} width={180} src={url}/>
        </div>
    )
}

export default GalleryCell
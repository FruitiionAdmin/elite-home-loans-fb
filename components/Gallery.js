import styles from '../styles/Home.module.css'
import GalleryRow from './GalleryRow'





const Gallery = (props) => {


    const photos = props.photos
    let rowPhotos = []
    let rows = []

    photos.forEach( (photo, index) => {
        rowPhotos.push([photo,index])
        if (rowPhotos.length == 3 || index + 1 == photos.length) {
            rows.push(rowPhotos)
            rowPhotos = []
        }
    })

    const galleryRows = rows.map( (photos,index) => {

        
        return (
            <GalleryRow photos={photos} key={index} previewPhoto={(photoIndex) => props.previewPhoto(photoIndex)}/>
        )
        
    })

    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminMediaMangement}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    
                    <div className={styles.galleryPhotoTable}>
                        {galleryRows}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Gallery
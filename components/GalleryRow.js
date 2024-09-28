import styles from '../styles/Home.module.css'
import Image from 'next/image'
import GalleryCell from './GalleryCell'


const GalleryRow = (props) => {

    const photos = props.photos

    const rowPhotos = photos.map( (photo,index) => {
        if (photo != "" ) {

            return (
                <GalleryCell url={photo[0]} preview={() => props.previewPhoto(photo[1])} key={index} />
            )
        }
        
    })

    return (
        <div className={styles.galleryRow}>
            {rowPhotos}
        </div>
    )


}

export default GalleryRow
import styles from '../styles/Home.module.css'
import Image from 'next/image'


const MediaButton = (props) => {

    return (
        <div className={styles.detailInlineButton} onClick={() => props.onClick()}>
            <div className={styles.detailInlineButtonTextContainer}>
                <a className={styles.detailInlineButtonText}>Media</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/folder.svg'width={25} height={25}/>
        </div>
    )
    
}

export default MediaButton
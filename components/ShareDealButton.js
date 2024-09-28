import styles from '../styles/Home.module.css'
import Image from 'next/image'


const ShareButton = (props) => {

    return (
        <div className={styles.filterButton} onClick={() => props.share()}>
            <div className={styles.filterButtonTextContainer}>
                <a className={styles.filterButtonText}>Share</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/shareIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default ShareButton
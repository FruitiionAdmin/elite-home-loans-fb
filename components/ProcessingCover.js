import styles from '../styles/Home.module.css'
import Image from 'next/image'


const ProcessingCover = (props) => {
    return (
        <div className={styles.processingCover}>
            <Image alt='Fruitiion login logo' className={styles.processingLogo} src='/fruitiionBannerLogoWhite.png' width={303} height={106} />
            <div className={styles.processSpinner}>
                <div className={styles.spinner}></div>
            </div>
        </div>
    )
    
}

export default ProcessingCover
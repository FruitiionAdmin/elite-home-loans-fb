import styles from '../styles/Home.module.css'
import Image from 'next/image'


const AskButton = (props) => {

    return (
        <div className={styles.filterButton} onClick={() => props.ask()}>
            <div className={styles.filterButtonTextContainer}>
                <a className={styles.filterButtonText}>Ask</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/messageIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default AskButton
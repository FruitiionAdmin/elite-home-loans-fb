import styles from '../styles/Home.module.css'
import Image from 'next/image'


const HamburgerButton = (props) => {

    return (
        <div className={styles.hamburgerButton} onClick={() => props.onClick()}>
            <div className={styles.hamburgerLinesContainer}>
                <div className={styles.hamburgerLine} />
                <div className={styles.hamburgerLine} />
                <div className={styles.hamburgerLine} />
            </div>
            <Image alt='input icon' className={styles.hamburgerImage} src='/userIcon.svg'width={24} height={24}/>
        </div>
    )
    
}

export default HamburgerButton
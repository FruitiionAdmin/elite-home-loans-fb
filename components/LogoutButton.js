import styles from '../styles/Home.module.css'
import Image from 'next/image'


const LogoutButton = (props) => {

    return (
        <div className={styles.logoutButton} onClick={() => props.onClick()}>
            <div className={styles.detailInlineButtonTextContainer}>
                <a className={styles.detailInlineButtonText}>Logout</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/closeIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default LogoutButton
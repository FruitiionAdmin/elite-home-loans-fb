import styles from '../styles/Home.module.css'
import Image from 'next/image'


const EquityManagementButton = (props) => {

    return (
        <div className={styles.detailInlineButton} onClick={() => props.onClick()}>
            <div className={styles.detailInlineButtonTextContainer}>
                <a className={styles.detailInlineButtonText}>Manage</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/groupIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default EquityManagementButton
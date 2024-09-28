import styles from '../styles/Home.module.css'
import Image from 'next/image'


const MakePaymentButton = (props) => {

    return (
        <div className={styles.requestExitButton} onClick={() => props.onClick()}>
            <div className={styles.detailInlineButtonTextContainer}>
                <a className={styles.detailInlineButtonText}>Make Payment</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/moveMoney.svg'width={25} height={25}/>
        </div>
    )
    
}

export default MakePaymentButton
import styles from '../styles/Home.module.css'
import Image from 'next/image'


const InvestButton = (props) => {

    return (
        <div className={styles.filterButton} onClick={() => props.invest()}>
            <div className={styles.filterButtonTextContainer}>
                <a className={styles.filterButtonText}>Invest</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/moneyIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default InvestButton
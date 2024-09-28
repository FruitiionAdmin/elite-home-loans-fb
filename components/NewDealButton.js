import styles from '../styles/Home.module.css'
import Image from 'next/image'


const NewDealButton = (props) => {


    return (
        <div className={styles.newDealButton} onClick={() => props.newDeal()}>
            <div className={styles.detailInlineButtonTextContainer}>
                <a className={styles.detailInlineButtonText}>New Deal</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/addIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default NewDealButton
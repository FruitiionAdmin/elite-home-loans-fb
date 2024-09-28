import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';



const SampleCard = (props) => {

    const item = props.item
    
    const id = item._id
    const imageUrl = item.image
    const title = item.nickname
    const lineOne = item.purchasePrice
    const lineTwo = item.totalRaise
    const lineThree = item.minInvestment
    const lineFour = item.maxInvestment


    const router = useRouter()
    return (
        <div className={styles.sampleCard}>
            <Image className={styles.cardImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='card photo' src={imageUrl} height={1000} width={1000} />
            <div className={styles.cardContentContainer}>
                <div className={styles.textContentContainer}>
                    <a className={styles.cardTitle}>{title}</a>
                    <a className={styles.cardInfo}>Purchase Price: {lineOne}</a>
                    <a className={styles.cardInfo}>Total Raise: {lineTwo}</a>
                    <a className={styles.cardInfo}>Min Investment: {lineThree}</a>
                    <a className={styles.cardInfo}>Max Investment: {lineFour}</a>
                </div>
                <Image className={styles.cardArrow} alt='arrow icon' src='/arrowIcon.svg' height={24} width={24} />
            </div>
        </div>
    )
    
}

export default SampleCard
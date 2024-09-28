import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';



const DealsCard = (props) => {

    const item = props.item
    
    const id = item._id
    const imageUrl = item.images[0] ? item.images[0] : '/placeholder.svg'
    const title = item.nickname
    const lineOne = item.purchasePrice
    const lineTwo = item.totalRaise
    const lineThree = item.status

    const investments = item.investments


    const router = useRouter()
    return (
        <div className={styles.feedCard} onClick={() => item.images[0] ? router.push(`/app/dealAdmin/${id}`) : null}>
            <Image className={styles.cardImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='card photo' src={imageUrl} height={1000} width={1000} />
            <div className={styles.cardContentContainer}>
                <div className={styles.textContentContainer}>
                    <a className={styles.cardTitle}>{title}</a>
                    <a className={styles.cardInfo}>Purchase Price: {lineOne}</a>
                    <a className={styles.cardInfo}>Total Raise: {lineTwo}</a>
                    <a className={styles.cardInfo}>{lineThree}</a>
                </div>
                { item.alert ?
                    <div className={styles.alertContainer}>
                        <a className={styles.alertText}>!</a>
                    </div> :
                    <Image className={styles.cardArrow} alt='arrow icon' src='/arrowIcon.svg' height={24} width={24} />
                }
            </div>
        </div>
    )
    
}

export default DealsCard
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';



const FeedCard = (props) => {

    const item = props.item
    
    const type = item[0]
    const id = item[1]
    const imageUrl = item[2]
    const title = item[3]
    const lineOne = item[4]
    const lineTwo = item[5]


    const router = useRouter()
    return (
        <div className={styles.feedCard} onClick={() => window.open(`/${type}/${id}`, '_blank', 'noreferrer')}>
            <Image className={styles.cardImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='card photo' src={imageUrl} height={1000} width={1000} />
            <div className={styles.cardContentContainer}>
                <div className={styles.textContentContainer}>
                    <a className={styles.cardTitle}>{title}</a>
                    <a className={styles.cardInfo}>{lineOne}</a>
                    <a className={styles.cardInfo}>{lineTwo}</a>
                </div>
                <Image className={styles.cardArrow} alt='arrow icon' src='/arrowIcon.svg' height={24} width={24} />
            </div>
        </div>
    )
    
}

export default FeedCard
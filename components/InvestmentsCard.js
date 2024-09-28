import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Link from 'next/link';
import {useRouter} from 'next/router';



const InvestmentsCard = (props) => {

    const investment = props.investment
    
    const id = investment._id
    const imageUrl = investment.image
    const title = investment.title
    const lineOne = investment.investmentAmount //investmentAmount
    const lineTwo = investment.type //investmentType
    const lineThree = investment.status //status


    const router = useRouter()
    return (
        <div className={styles.feedCard} onClick={() => router.push(`/app/investmentAdmin/${id}`)}>
            <Image className={styles.cardImage} placeholder="blur" blurDataURL='/placeholder.svg' alt='card photo' src={imageUrl} height={1000} width={1000} />
            <div className={styles.cardContentContainer}>
                <div className={styles.textContentContainer}>
                    <a className={styles.cardTitle}>{title}</a>
                    <a className={styles.cardInfo}>{lineOne}</a>
                    <a className={styles.cardInfo}>{lineTwo}</a>
                    <a className={styles.cardInfo}>{lineThree}</a>
                </div>
                { investment.status == "Awaiting Documents" ||  investment.status == "Awaiting Payment"?
                    <div className={styles.alertContainer}>
                        <a className={styles.alertText}>!</a>
                    </div> :
                    <Image className={styles.cardArrow} alt='arrow icon' src='/arrowIcon.svg' height={24} width={24} />
                }
            </div>
        </div>
    )
    
}

export default InvestmentsCard
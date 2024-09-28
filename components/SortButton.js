import styles from '../styles/Home.module.css'
import Image from 'next/image'


const SortButton = (props) => {

    return (
        <div className={styles.filterButton} onClick={() => props.onClick()}>
            <div className={styles.filterButtonTextContainer}>
                <a className={styles.filterButtonText}>Sort</a>
            </div>
            <div className={styles.sortLinesContainer}>
                <div className={styles.sortLineOne} />
                <div className={styles.sortLineTwo} />
                <div className={styles.sortLineThree} />
            </div>
        </div>
    )
    
}

export default SortButton
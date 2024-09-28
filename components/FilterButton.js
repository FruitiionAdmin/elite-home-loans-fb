import styles from '../styles/Home.module.css'
import Image from 'next/image'


const FilterButton = (props) => {

    return (
        <div className={styles.filterButton}>
            <div className={styles.filterButtonTextContainer}>
                <a className={styles.filterButtonText}>Filter</a>
            </div>
            <Image alt='filter icon' className={styles.filterImage} src='/filterIcon.svg'width={25} height={25}/>
        </div>
    )
    
}

export default FilterButton
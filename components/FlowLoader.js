import styles from '../styles/Home.module.css'
import Image from 'next/image'


const FlowLoader = (props) => {
    return (
        <div className={styles.flowLoader}>
            <div className={styles.loadSpinner}>
                <div className={styles.spinner}></div>
            </div>
        </div>
    )
    
}

export default FlowLoader
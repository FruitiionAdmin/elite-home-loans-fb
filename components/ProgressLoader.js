import styles from '../styles/Home.module.css'
import Image from 'next/image'
import calculatePercentage from '../functions/calculatePercentage'


const ProgressLoader = (props) => {

    const {current, total} = props

    return (
        <div className={styles.flowLoader}>
            <div className={styles.loadSpinner}>
                <div className={styles.spinner}></div>
                <br />
                <div className={styles.progressMessageContainer}>
                    <a>Please wait while we upload your assets.</a>
                    <a>Do not leave or refresh this page.</a>
                    <br />
                    <a>{calculatePercentage(`${current}`,`${total}`)}</a>
                </div>
            </div>
        </div>
    )
    
}

export default ProgressLoader
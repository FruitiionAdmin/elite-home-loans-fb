import styles from '../styles/Home.module.css'
import Image from 'next/image'
import MediaManagementPhotoCell from './MediaManagementPhotoCell'






const DealAdminEquityManagment = (props) => {


    const investors = props.investors

    const investorCells = investors.map( (investor,index) => {
        return (
            <div className={styles.equityManagementCell} key={index}>
                <Image className={styles.equityManagementInvestorPic} alt='investor profile pic' height={100} width={100} src='/testUserOne.png'/>
                <a className={styles.equitManagementCellInvestorName}>Michael Balares</a>
                <input className={styles.equityManagementCellInput} placeholder={15}/>
                <a className={styles.equityManagementCellPercentage}>%</a>
                <a className={styles.equityManagementCellInvestmentAmount}>$40,000</a>
            </div>
        )
    })

    
    return (
        <div className={styles.modalContainer}>
            <div className={styles.dealAdminMediaMangement}>
                <div className={styles.modalCloseRow}>
                    <a className={styles.modalClose} onClick={() => props.close()}>X</a>
                </div>
                <div className={styles.modalContent}>
                    <div className={styles.dealAdminEquityManagementTable}>
                        {investorCells}
                    </div>
                    <div className={styles.equityManagmentBottomRow}>
                        <a className={styles.equityMangementTotal}>Total: 100%</a>
                        <button className={styles.equityMangementSaveButton}>SAVE</button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DealAdminEquityManagment
import styles from '../styles/Home.module.css'
import UserEquityCell from './UserEquityCell'
import Image from 'next/image'


const UserEquityTable = (props) => {

    const investors = props.investors

const userRows = investors.map( (investor, index) => {


    return (
        <UserEquityCell key={index} investor={investor}/>
    )
})

    return (
        <div className={styles.adminTableContaier}>
            <div className={styles.dealDetailCell}>
                <div className={styles.equityCellSpacer}/>
                <a className={styles.userEquityCellName}>Name</a>
                <a className={styles.userEquityCellEquity}>Equity</a>
                <a className={styles.userEquityCellEquity}>Amount</a>
                <a className={styles.userEquityCellEquity}>Email</a>
                <a className={styles.userEquityCellEquity}>Phone</a>
            </div>
            {userRows}
        </div>
    )
    
}

export default UserEquityTable
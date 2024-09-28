import styles from '../styles/Home.module.css'
import Image from 'next/image'
import {useRouter} from 'next/router';
import { currentDomain } from '../const';


const AppContainer = ({ secondRowContnet, appContent, activeSection, userType}) => {

    const router = useRouter()

    const logout = async () => {
        const logoutResponse = await fetch(`${currentDomain}/api/logout`, {
            method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                test: "logged out"
              })
          })
          const logoutData = await logoutResponse.json()
          console.log(logoutData)
          if (logoutData.result == "success") {
           router.push('/')
          }
    }

    return (
        <div className={styles.appContainer}>
            <div className={styles.appFirstRow}>
                <div className={styles.appLogoContainer}>
                    <Image className={styles.appLogo} src='/ehlLogo.png' alt='fruitiion logo' height={270} width={270} />
                </div>
                <div className={styles.appSideControlsContainer}>
                    <div className={styles.hamburgerContainer}>
                        <button className={styles.logoutButton} onClick={() => logout()}>Logout</button>
                    </div>
                </div>
            </div>
            <div className={styles.appSecondRow}>
                <div className={styles.appNavigationContainer}>
                    {
                        userType != "guest" ?
                        <div className={styles.navItemContainer} style={activeSection == 'offerings' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                            <a onClick={() => activeSection != 'offerings' ? router.push('/app/offerings') : null} className={styles.navItem} style={activeSection == 'offerings' ? {color:'#1C206B'}: null}>OFFERINGS</a>
                        </div>:
                        null
                    }
                    {
                        userType == "sponsor" ?
                        <div className={styles.navItemContainer} style={activeSection == 'deals' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                            <a onClick={() => activeSection != 'deals' ? router.push('/app/deals') : null} className={styles.navItem} style={activeSection == 'deals' ? {color:'#1C206B'}: null}>MY DEALS</a>
                        </div>:
                        null
                    }
                    {
                        userType == "investor" ?
                        <div className={styles.navItemContainer} style={activeSection == 'investments' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                            <a onClick={() => activeSection != 'investments' ? router.push('/app/investments') : null} className={styles.navItem} style={activeSection == 'investments' ? {color:'#1C206B'}: null}>MY INVESTMENTS</a>
                        </div>:
                        null
                    }
                    {
                        userType == "sponsor" ?
                        <div className={styles.navItemContainer} style={activeSection == 'admin' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                            <a onClick={() => activeSection != 'admin' ? router.push('/app/admin') : null}  className={styles.navItem} style={activeSection == 'admin' ? {color:'#1C206B'}: null}>ADMIN</a>
                        </div>:
                        null
                    }
                    {
                        false ?
                        <div className={styles.navItemContainer} style={activeSection == 'billing' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                            <a onClick={() => activeSection != 'billing' ? router.push('/app/billing') : null}  className={styles.navItem} style={activeSection == 'billing' ? {color:'#1C206B'}: null}>BILLING</a>
                        </div>:
                        null
                    }
                    <div className={styles.navItemContainer} style={activeSection == 'profile' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                        <a onClick={() => activeSection != 'profile' ? router.push('/app/profile') : null} className={styles.navItem} style={activeSection == 'profile' ? {color:'#1C206B'}: null}>PROFILE</a>
                    </div>
                    
                    

                </div>
                <div className={styles.secondRowContentContainer}>
                    {secondRowContnet}
                </div>
            </div>
            <div className={styles.appContentContainer}>
                {appContent}
            </div>
        </div>
    )
    
}

export default AppContainer
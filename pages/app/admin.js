import Head from 'next/head'
import {useRouter} from 'next/router';
import styles from '../../styles/Home.module.css'
import { useState, useEffect} from 'react'
import AppContainer from '../../components/AppContainer';
import FlowLoader from '../../components/FlowLoader';
import { currentDomain } from '../../const';
import Footer from '../../components/FruitiionFooter';
import InviteInvestorModal from '../../components/InviteInvestorUser';
import AddSponsorModal from '../../components/AddSponsorUser';
import isEmailValid from '../../functions/isEmailValid';
import CompletionModal from '../../components/CompletionModal';
import InvestorTable from '../../components/InvestorTable';
import SponsorTable from '../../components/SponsorTable';
import ReviewSponsorModal from '../../components/ReviewSponsorModal';
import ReviewInvestorModal from '../../components/ReviwInvestorModal';
import PdfPreviewModal from '../../components/PdfPreviewModal';
import pdfBuffer from '../../functions/pdfBuffer';
import isScreenMobile from '../../functions/isScreenMobile';


export default function Profile() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState()
  const [assetsUnderManagement, setAssetsUnderManagment] = useState("$0")
  const [totalRaised, setTotalRaised] = useState("$0")
  const [showInviteInvestor, setShowInviteInvestor] = useState(false)
  const [investorName, setInvestorName] = useState("")
  const [investorEmail, setInvestorEmail] = useState("")
  const [investorMessage, setInvestorMessage] = useState("")
  const [showAddSponsor, setShowAddSponsor] = useState(false)
  const [sponsorName, setSponsorName] = useState("")
  const [sponsorEmail, setSponsorEmail] = useState("")
  const [sponsorMessage, setSponsorMessage] = useState("")
  const [activeUserManagementState, setActiveUserManagementState] = useState("sponsors")
  const [inviteInvestorError, setInviteInvestorError] = useState("")
  const [addSponsorError, setAddSponsorError] = useState("")
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionTitle, setCompletionTitle] = useState("")
  const [completionMessage, setCompletionMessage] = useState("")
  const [sponsors, setSponsors] = useState([])
  const [investors, setInvestors] = useState([])
  const [sponsorReview, setSponsorReview] = useState()
  const [sponsorReviewModalError, setSponsorReviewModalError] = useState("")
  const [investorReview, setInvestorReview] = useState()
  const [investorReviewModalError, setInvestorReviewModalError] = useState("")
  const [w9Preview, setW9Preview] = useState()



  const initializeAdmin = async () => {
    setIsLoading(true)

    const initializeAdminResponse  = await fetch(`${currentDomain}/api/initializeAdmin`)
    const initializeAdminData = await initializeAdminResponse.json()

    if (initializeAdminData.result == 'unauthorized') {
      router.push('/app/offerings')
      return
    }

    if (initializeAdminData.result == "success" ) {
      const { sponsors, investors, assetsUnderManagement, totalRaised, user} = initializeAdminData
      setUser(user)
      setAssetsUnderManagment(assetsUnderManagement)
      setTotalRaised(totalRaised)
      setSponsors(sponsors)
      setInvestors(investors)
    }

    setIsLoading(false)
  }

  const onInvestorNameChange = (name) => {
    setInviteInvestorError("")
    setInvestorName(name)
  }

  const onInvestorEmailChange = (email) => {
    setInviteInvestorError("")
    setInvestorEmail(email)
  }

  const onSponsorNameChange = (name) => {
    setAddSponsorError("")
    setSponsorName(name)
  }

  const onSponsorEmailChange = (email) => {
    setAddSponsorError("")
    setSponsorEmail(email)
  }

  const sendInvestorInvite = async () => {
    setIsLoading(true)
    setInviteInvestorError("")
    if (investorName == "") {
      setInviteInvestorError("A name is required.")
      setIsLoading(false)
      return
    }
    if (isEmailValid(investorEmail) != true) {
      setInviteInvestorError("A valid email is required.")
      setIsLoading(false)
      return
    }
    try {
      const inviteInvestorResponse = await fetch (`${currentDomain}/api/inviteInvestor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationName:investorName,
          email: investorEmail,
          message: investorMessage
        })
      })
      const inviteInvestorData = await inviteInvestorResponse.json()
      if (inviteInvestorData.message) {
        setInviteInvestorError("An account with this email already exists.")
        setIsLoading(false)
        return
      }
      if (inviteInvestorData.investorId) {
        setShowInviteInvestor(false)
        setIsLoading(false)
        setShowCompletion(true)
        setCompletionTitle("Invite Sent")
        setCompletionMessage("An email has been sent to the provided email address with a link to complete their registration. Please inform the invitee that if they cannot see the email to check their spam folder.")
      } else {
        setInviteInvestorError("Write error.")
      }
    } catch (e) {
      console.log(e)
      setInviteInvestorError("Invitation Error.")
    }
    setIsLoading(false)
  }

  const addSponsor = async () => {
    setIsLoading(true)
    setAddSponsorError("")
    if (sponsorName == "") {
      setAddSponsorError("A name is required.")
      setIsLoading(false)
      return
    }
    if (isEmailValid(sponsorEmail) != true) {
      setAddSponsorError("A valid email is required.")
      setIsLoading(false)
      return
    }
    try {
      const addSponsorResponse = await fetch (`${currentDomain}/api/addSponsor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invitationName:sponsorName,
          email: sponsorEmail,
          message: sponsorMessage
        })
      })
      const addSponsorData = await addSponsorResponse.json()
      if (addSponsorData.message) {
        setAddSponsorError("An account with this email already exists.")
        setIsLoading(false)
        return
      }
      if (addSponsorData.sponsorId) {
        setShowAddSponsor(false)
        setIsLoading(false)
        setShowCompletion(true)
        setCompletionTitle("Invite Sent")
        setCompletionMessage("An email has been sent to the provided email address with a link to complete their registration. Please inform the invitee that if they cannot see the email to check their spam folder.")
      } else {
        setInviteInvestorError("Write error.")
      }
    } catch (e) {
      console.log(e)
      setAddSponsorError("Invitation Error.")
    }
    setIsLoading(false)
  }

  const closeCompletion = () => {
    setShowCompletion(false)
    setCompletionTitle("")
    setCompletionMessage("")
    initializeAdmin()
  }

  const phoneNumberOnChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/\D/g, '');
    const formattedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    if (formattedValue.length <= 14) {
      setSponsorPhoneNumber(formattedValue);
    }
  }

  const deactivateSponsor = async () => {

    setIsLoading(true)

    const deactivateSponsorResponse = await fetch (`${currentDomain}/api/deactivateSponsor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:sponsorReview._id,
      })
    })

    const deactivateSponsorData = await deactivateSponsorResponse.json()

    if (deactivateSponsorData.error == null) {
      setSponsorReview()
      initializeAdmin()
    } else {
      setSponsorReviewModalError(deactivateSponsorData.error)
    }
    setIsLoading(false)
  }

  const deactivateInvestor = async () => {

    setIsLoading(true)

    const deactivateInvestorResponse = await fetch (`${currentDomain}/api/deactivateInvestor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:investorReview._id,
      })
      
    })

    const deactivateInvestorData = await deactivateInvestorResponse.json()

    if (deactivateInvestorData.error == null) {
      initializeAdmin()
    } else {
      setSponsorReviewModalError(deactivateInvestorData.error)
    }
    setInvestorReview()
    setIsLoading(false)
  }

  const activateSponsor = async () => {

    setIsLoading(true)

    const activateSponsorResponse = await fetch (`${currentDomain}/api/activateSponsor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:sponsorReview._id,
      })
    })

    const activateSponsorData = await activateSponsorResponse.json()

    if (activateSponsorData.error == null) {
      setSponsorReview()
      initializeAdmin()
    } else {
      setSponsorReviewModalError(activateSponsorData.error)
    }
    setIsLoading(false)
  }

  const makeSuper = async () => {
    setIsLoading(true)

    const makerSuperResponse = await fetch (`${currentDomain}/api/makeSuper`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:sponsorReview._id,
      })
    })

    const makeSuperData = await makerSuperResponse.json()

    if (makeSuperData.error == null) {
      setSponsorReview()
      initializeAdmin()
    } else {
      setSponsorReviewModalError(makeSuperData.error)
    }
    setIsLoading(false)
  }

  const removeSuper = async () => {
    setIsLoading(true)

    const removeSuperResponse = await fetch (`${currentDomain}/api/removeSuper`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:sponsorReview._id,
      })
    })

    const removeSuperData = await removeSuperResponse.json()

    if (removeSuperData.error == null) {
      setSponsorReview()
      initializeAdmin()
    } else {
      setSponsorReviewModalError(removeSuperData.error)
    }
    setIsLoading(false)
  }

  const activateInvestor = async () => {

    setIsLoading(true)

    const activateInvestorResponse = await fetch (`${currentDomain}/api/activateInvestor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id:investorReview._id,
      })
      
    })

    const activateInvestorData = await activateInvestorResponse.json()

    if (activateInvestorData.error == null) {
      initializeAdmin()
    } else {
      setSponsorReviewModalError(activateInvestorData.error)
    }
    setInvestorReview()
    setIsLoading(false)
  }

  const viewPdf = async (url) => {
    setIsLoading(true)
    const iqsBuffer = await pdfBuffer(url)
    setIsLoading(false)
    setW9Preview(iqsBuffer)
  }

  useEffect(() => {
    const handleResize = () => {
      if (isScreenMobile(window)) {
        router.push('/mobileMessage')
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    initializeAdmin()
  }, [])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Fruitiion</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/fruitiionIcon.svg" />
      </Head>
      <AppContainer
        userType='sponsor'
        activeSection='admin'
        secondRowContnet={
            <>
              <div className={styles.secondAppSpacer}/>
              
            </>
        }
        appContent={
            <>
            <div className={styles.adminContainer}>
              <div className={styles.userManagmentContainer}>
                <div className={styles.userManagmentNavigationContainer}>
                  <div className={styles.navItemContainer} style={activeUserManagementState == 'sponsors' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                      <a onClick={() => setActiveUserManagementState("sponsors")} className={styles.navItem} style={activeUserManagementState == 'sponsors' ? {color:'#1C206B'}: null}>SPONSORS</a>
                  </div>
                  <div className={styles.navItemContainer} style={activeUserManagementState == 'investors' ? {borderColor:'#1C206B'}: {borderColor:'white'}}>
                      <a onClick={() => setActiveUserManagementState("investors")} className={styles.navItem} style={activeUserManagementState == 'investors' ? {color:'#1C206B'}: null}>INVESTORS</a>
                  </div>
                  {
                    activeUserManagementState == "sponsors" ?
                    user != null && user.superUser ? <button className={styles.userEquityCellChatButton} onClick={() => setShowAddSponsor(true)}>Add Sponsor</button> : null :
                    <button className={styles.userEquityCellChatButton} onClick={() => setShowInviteInvestor(true)}>Invite Investor</button>
                  }
                </div>
                {
                  activeUserManagementState == "sponsors" ?
                  <SponsorTable sponsors={sponsors} review={(index) => setSponsorReview(sponsors[index])} />:
                  <InvestorTable investors={investors} review={(index) => setInvestorReview(investors[index])}/>
                }
              </div>
              <div className={styles.profileInfoContainer}>
                <div className={styles.walletRowContainer}>
                  <div className={styles.statsContainer}>
                    <a className={styles.statsTitle}>Sponsor Stats</a>
                    <div className={styles.statsRow}>
                      <a className={styles.statsLabel}>Assets Under Management:</a>
                      <a className={styles.statsMetric}>{assetsUnderManagement}</a>
                    </div>
                    <div className={styles.statsRow}>
                      <a className={styles.statsLabel}>Total Raised:</a>
                      <a className={styles.statsMetric}>{totalRaised}</a>
                    </div>
                  </div>
                </div>
              </div>
  
            </div>
            {
              showInviteInvestor ?
              <InviteInvestorModal close={() => setShowInviteInvestor(false)} name={investorName} error={inviteInvestorError}  email={investorEmail} message={investorMessage} onNameChange={(event) => onInvestorNameChange(event.target.value)} onEmailChange={(event) => onInvestorEmailChange(event.target.value) } onMessageChange={(event) => setInvestorMessage(event.target.value)} submit={() => sendInvestorInvite()}/>:
              null
            }
            {
              showAddSponsor ?
              <AddSponsorModal close={() => setShowAddSponsor(false)} name={sponsorName} error={addSponsorError} email={sponsorEmail} message={sponsorMessage} onNameChange={(event) => onSponsorNameChange(event.target.value)} onEmailChange={(event) => onSponsorEmailChange(event.target.value) } onMessageChange={(event) => setSponsorMessage(event.target.value)} submit={() => addSponsor()}/>:
              null
            }
            {
              showCompletion ?
              <CompletionModal close={() => closeCompletion()} title={completionTitle} message={completionMessage} />:
              null
            }
            {
              sponsorReview ?
              <ReviewSponsorModal close={() => setSponsorReview()} sponsor={sponsorReview} activate={() => activateSponsor()} deactivate={() => deactivateSponsor()} makeSuper={() => makeSuper()} removeSuper={() => removeSuper()}/>:
              null
            }
            {
              investorReview ?
              <ReviewInvestorModal cancel={() => setInvestorReview()} investor={investorReview} previewPdf={() => viewPdf(investorReview.w9)} deactivate={() => deactivateInvestor()} activate={() => activateInvestor()}/>:
              null
            }
            {
              w9Preview != null ?
              <PdfPreviewModal url={w9Preview} close={() => setW9Preview()} />:
              null
            }
            </>
        }
      />
      {
        isLoading ?
        <FlowLoader />:
        null
      }
      
      <Footer />
    </div>
  )
}

import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import { useState, useEffect, isValidElement } from 'react'
import styles from '../../styles/Home.module.css'
import AppContainer from '../../components/AppContainer';
import SponsorContactTable from '../../components/SponsorContactTable';
import ShareDeal from '../../components/ShareDeal';
import AskSponsors from '../../components/AskSponsors';
import Gallery from '../../components/Gallery';
import PreviewPhoto from '../../components/PreviewPhoto';
import FlowLoader from '../../components/FlowLoader';
import { currentDomain } from '../../const';
import calculatePercentage from '../../functions/calculatePercentage';
import Footer from '../../components/FruitiionFooter';
import CompletionModal from '../../components/CompletionModal';
import isScreenMobile from '../../functions/isScreenMobile';


export default function DealDetail () {
    const router = useRouter()
    
    const { dealId } = router.query

    const [userType, setUserType] = useState("guest")
    const [deal, setDeal] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [sponsorsLocked, setSponsorsLocked] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [showSponsors, setShowSponsors] = useState(false)
    const [showShareDeal, setShowShareDeal] = useState(false)
    const [shareEmails, setShareEmails] = useState([])
    const [newEmail, setNewEmail] = useState('')
    const [showAskSponsors, setShowAskSponsors] = useState('')
    const [askReturnEmail, setAskReturnEmail] = useState('')
    const [askMessage, setAskMessage] = useState('')
    const [showGallery, setShowGallery] = useState(false)
    const [previewPhoto, setPreviewPhoto] = useState()
    const [completionTitle, setCompletionTitle] = useState("")
    const [completionMessage, setCompletionMessage] = useState("")


    const addEmail = (email) => {
        let newEmails = [...shareEmails]
        newEmails.push(email)
        setShareEmails(newEmails)
        setNewEmail('')
    }

    const removeEmail = (index) => {
        let newEmails = [...shareEmails]
        newEmails.splice(index,1)
        console.log(newEmails)
        console.log(index)
        setShareEmails(newEmails)
    }

    const showPreviewPhoto = (index) => {
        let photo = deal.images[index]
        setPreviewPhoto(photo)
    }

    const initializeDealDetail = async (id) => {
        setIsLoading(true)
        const dealDetailResponse = await fetch(`${currentDomain}/api/initializeDealDetail`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dealId: id
            })
        })


        const dealDetailData = await dealDetailResponse.json()
        console.log(dealDetailData)
        if (dealDetailData.result != "success") router.push("/")
        setDeal(dealDetailData.deal)
        setUserType(dealDetailData.userType)
        setIsLoading(false)
    }

    const isEmailValid = () => {
        // Define a regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Test the email against the regex and return the result
        return emailRegex.test(askReturnEmail);
    }

    const sendSponsorsMessage = async () => {
        setIsLoading(true)
        
        if (askMessage != null && isEmailValid(askReturnEmail)) {
            const sendSponsorEmailResponse = await fetch(`${currentDomain}/api/sendSponsorMessage`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: askMessage,
                    sponsors: deal.sponsors,
                    returnEmail: askReturnEmail
                })
            })
    
            const sendSponsorEmailData = await sendSponsorEmailResponse.json()
            console.log(sendSponsorEmailData)
        }
        setIsLoading(false)
        setShowAskSponsors(false)
        setIsLoading(false)
        setCompletionTitle("Sent!")
        setCompletionMessage("Your message has been sent.")
    }

    const sendShareEmail = async () => {
        setIsLoading(true)
        if (shareEmails.length != 0) {
            const sendShareEmailResponse = await fetch(`${currentDomain}/api/sendShareEmail`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    emails: shareEmails,
                    deal: deal
                })
            })

            const sendShareEmailData = await sendShareEmailResponse.json()
            console.log(sendShareEmailData)
        }
        setIsLoading(false)
        setShowShareDeal(false)
        setShareEmails([])
        setCompletionTitle("Sent!")
        setCompletionMessage("Your message has been sent.")
    }

    const investInDeal = () => {
        
        if (userType != 'investor') {
            router.push(`/investorReminder`)
        } else {
            router.push(`/app/newInvestment/${dealId}`)
        }

    }

    useEffect(() => {
        const handleResize = () => {
            if (isScreenMobile(window)) {
                router.push('/mobileMessage')
            }
        }
        window.addEventListener("resize", handleResize)
        handleResize()
        if (dealId) {
            (async () => {
                initializeDealDetail(dealId)
            })()
        }
    }, [dealId])


    return (
        <div className={styles.container}>
            <Head>
            <title>Fruitiion</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/fruitiionIcon.svg" />
            </Head>
            <AppContainer
                userType={userType}
                activeSection=''
                secondRowContnet={
                    <>
                    <div className={styles.adminTitleContainer}>
                        <a className={styles.adminTitle}>DEAL OVERVIEW</a>
                    </div>
                    <div className={styles.dealDetailButtonContainer}>
                        {
                            userType != "guest" ?
                            <>
                            <button className={styles.userEquityCellChatButton} onClick={() => setShowShareDeal(true)}>Share</button>
                            <button className={styles.userEquityCellChatButton} onClick={() => setShowAskSponsors(true)}>Ask</button>
                            <button className={styles.userEquityCellChatButton} onClick={() => investInDeal()}>Invest</button>
                            </> :
                            null
                        }
                    </div>
                    </>
                }
                appContent={
                    <>
                    <div className={styles.dealDetailContentContainer}>
                        <div className={styles.dealDetailPhotosContainer} onClick={() => setShowGallery(true)}>
                            <Image  src={deal ? deal.images[0] : '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal main photo' className={styles.dealDetailMainPhoto} height={500} width={500} priority/>
                            <div className={styles.dealDetailAlternatePhotosContainer}>
                                <div className={styles.altPhotosRow}>
                                    <Image onClick={() => setShowGallery(true)} src={deal ? deal.images[1] : '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoOne} height={300} width={250}/>
                                    <Image onClick={() => setShowGallery(true)} src={deal ? deal.images[2] : '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoTwo} height={300} width={250}/>
                                </div>
                                <div className={styles.altPhotosRow}>
                                    <Image onClick={() => setShowGallery(true)} src={deal ? deal.images[3] : '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoThree} height={300} width={250}/>
                                    <Image onClick={() => setShowGallery(true)} src={deal ? deal.images[4] : '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoFour} height={300} width={250}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dealDetailGeneralInfoContainer}>
                            <div className={styles.textDetailsContainer}>
                                <a className={styles.dealDetailTitle}>{deal ? deal.nickname: null}</a>
                                <a className={styles.dealDetailInfo}>{deal ? deal.city : null} | {deal ? deal.state : null} </a>
                                <a className={styles.dealDetailInfo}><strong>Purchase Price:</strong> {deal ? deal.purchasePrice : null}</a>
                                <a className={styles.dealDetailInfo}><strong>Total Raise:</strong> {deal ? deal.totalRaise : null}</a>
                                <a className={styles.dealDetailInfo}><strong>Status:</strong> {deal ? deal.status : null}</a>
                            </div>
                            <div className={styles.dealGraphsContainer}>
                                <div className={styles.dealGraphContainer}>
                                    <a className={styles.graphTitle}>Total Raised</a>
                                    <br />
                                    <div className={styles.graphMetricsContainer}>
                                        <a className={styles.graphPrimaryMetrics}>{deal ? deal.raised : null} of {deal ? deal.totalRaise : null}</a>
                                    </div>
                                    <div className={styles.graphBarEmpty}>
                                    <div className={styles.graphBar} style={deal ? {width:calculatePercentage(deal.raised,deal.totalRaise)}: null}/>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <br />
                        <div className={styles.dealNumbersContainer}>
                            <div className={styles.dealDetailMetricContainer}>
                                <a className={styles.dealMetricTitle}>Minimum Investment</a>
                                <a className={styles.dealMetric}>{deal ? deal.minInvestment : null}</a>
                            </div>
                            <div className={styles.dealDetailMetricContainer}>
                                <a className={styles.dealMetricTitle}>Maximum Investment</a>
                                <a className={styles.dealMetric}>{deal ? deal.maxInvestment : null}</a>
                            </div>
                            <div className={styles.dealDetailMetricContainer}>
                                <a className={styles.dealMetricTitle}>Projected ROI</a>
                                <a className={styles.dealMetric}>{deal ? deal.projRoi: null}%</a>
                            </div>
                            <div className={styles.dealDetailMetricContainer}>
                                <a className={styles.dealMetricTitle}>Investment</a>
                                <a className={styles.dealMetric}>{deal ? deal.investmentType : null}</a>
                            </div>
                            <div className={styles.dealDetailMetricContainer}>
                                <a className={styles.dealMetricTitle}>Term</a>
                                <a className={styles.dealMetric}>{deal ? deal.lengthOfDeal : null} months</a>
                            </div>
                        </div>
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => setShowDetails(!showDetails)}>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Summary</a>
                                    <Image className={styles.toggleArrow} style={showDetails ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src="/rightArrow.svg"/>
                                </div>
                                
                            </div>
                        </div>
                        {
                            showDetails ?
                            <div className={styles.dealDetailTableContainer}>
                                <br />
                                <p className={styles.dealDetailSummary}>{deal.summary}</p>
                            </div>:
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => !sponsorsLocked ? setShowSponsors(!showSponsors) : null}>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Sponsors</a>
                                    <Image className={styles.toggleArrow} style={showSponsors ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src={sponsorsLocked ? "/lockIconGrey.svg": "/rightArrow.svg"}/>
                                </div>
                            </div>
                        </div>
                        {
                            showSponsors ?
                            <div className={styles.dealDetailTableContainer}>
                                <SponsorContactTable sponsors={deal.sponsors} contact={() => setShowAskSponsors(true)}/>
                            </div> :
                            null
                        }
                        {
                            showShareDeal ?
                            <ShareDeal newEmail={newEmail} onChange={(email) => setNewEmail(email)} addEmail={() => addEmail(newEmail)} emails={shareEmails} removeEmail={(index) => removeEmail(index)} close={() => setShowShareDeal(false)} sendShareEmail={() => sendShareEmail()}/>:
                            null
                        }
                        {
                            showAskSponsors ?
                            <AskSponsors returnEmail={askReturnEmail} onMessageChange={(message) => setAskMessage(message)} onEmailChange={(email) => setAskReturnEmail(email)} addEmail={() => addEmail(newEmail)} emails={shareEmails} removeEmail={(index) => removeEmail(index)} close={() => setShowAskSponsors(false)} sendEmail={() => sendSponsorsMessage()}/>:
                            null
                        }
                        {
                            showGallery ?
                            <Gallery photos={deal.images} previewPhoto={(index) => showPreviewPhoto(index)} close={() => setShowGallery(false)}/>:
                            null
                        }
                        {
                            previewPhoto != null ?
                            <PreviewPhoto url={previewPhoto} close={() => setPreviewPhoto()}/>:
                            null
                        }
                        {
                            completionTitle != "" ?
                            <CompletionModal title={completionTitle} message={completionMessage} close={() => {
                                setCompletionTitle("")
                                setCompletionMessage("")
                            }}/>:
                            null
                        }
                        <div className={styles.bottomSpacer}/>
                    </div>
                    
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


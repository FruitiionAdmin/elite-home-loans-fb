import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import { useState, useEffect, use } from 'react'
import styles from '../../../styles/Home.module.css'
import AppContainer from '../../../components/AppContainer';
import SponsorContactTable from '../../../components/SponsorContactTable';
import DealDetailDocumentsTable from '../../../components/DealDetailDocumentsTable';
import DealAdminDistributionTable from '../../../components/DealAdminDistributionsTable';
import InvestmentAdminUploadDocuments from '../../../components/InvestmentAdminUploadDocuments';
import InvestmentAdminRequestExit from '../../../components/InvestmentAdminRequestExit';
import InvestmentAdminMakePayment from '../../../components/InvestmentAdminMakePayment';
import FlowLoader from '../../../components/FlowLoader';
import { currentDomain } from '../../../const';
import AskSponsors from '../../../components/AskSponsors';
import PdfPreviewModal from '../../../components/PdfPreviewModal';
import pdfBuffer from '../../../functions/pdfBuffer';
import { investmentStorageRef } from '../../../firebase';
import calculatePercentage from '../../../functions/calculatePercentage';
import Footer from '../../../components/FruitiionFooter';
import InvestorActionButton from '../../../components/InvestorActionButton';
import DealDetailReportsTable from '../../../components/DealDetailReportsTable';
import ProgressLoader from '../../../components/ProgressLoader';
import Gallery from '../../../components/Gallery';
import PreviewPhoto from '../../../components/PreviewPhoto';
import isScreenMobile from '../../../functions/isScreenMobile';


export default function InvestmentAdmin () {
    const router = useRouter()
    const { investmentId } = router.query

    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [filesUploaded, setFilesUploaded] = useState(0)
    const [filesToUpload, setFilesToUpload] = useState(0)
    const [showSponsors, setShowSponsors] = useState(false)
    const [showDocuments, setShowDocuments] = useState(false)
    const [showReports, setShowReports] = useState(false)
    const [showDistributions, setShowDistributions] = useState(false)
    const [showUploadDocuments, setShowUploadDocuments] = useState(false)
    const [showRequestExit, setShowRequestExit] = useState(false)
    const [showAskSponsors, setShowAskSponsors] = useState()
    const [showMakePayment, setShowMakePayment] = useState(false)
    const [askReturnEmail, setAskReturnEmail] = useState('')
    const [askMessage, setAskMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [showGallery, setShowGallery] = useState(false)
    const [previewPhoto, setPreviewPhoto] = useState()

    const [deal, setDeal] = useState()
    const [investment, setInvestment] = useState()
    const [documents, setDocuments] = useState([])

    const [sponsorsLocked, setSponsorsLocked] = useState(false)
    const [reportsLocked, setReportsLocked] = useState(true)

    const [userType, setUserType] = useState("investor")

    const [showPdfPreview, setShowPdfPreview] = useState()

    const [uploadDocumentUrls, setUploadDocumentUrls] = useState([])

    const onDocumentChange = (event) => {
        const documents = event.target.files
        const length = documents.length
        for (let docIndex = 0; docIndex < length; docIndex++) {
        const url = URL.createObjectURL(documents[docIndex])
        setUploadDocumentUrls(uploadDocumentUrls => [...uploadDocumentUrls,{url, name: documents[docIndex].name}])
        }
        setErrorMessage("")
    }

    const removeDocument = (index) => {
        let currentDocs = uploadDocumentUrls
      
        // Create a new array without the item at the specified index
        const newArray = [...currentDocs.slice(0, index), ...currentDocs.slice(index + 1)];
        setUploadDocumentUrls(newArray)
      }

    const uploadInvestmentDocs = async () => {
        setFilesToUpload(uploadDocumentUrls.length)
        setIsUploading(true)
        if (uploadDocumentUrls.length == 0) {
            setErrorMessage("Please select documents to upload.")
            setIsUploading(false)
            return
        }
        let uploadTracker = filesUploaded
        let uploadedDocumentUrls
        try {
            const metadata = {
                customMetadata: {
                  'secret': process.env.NEXT_PUBLIC_FIREBASE
                }
              };
            uploadedDocumentUrls = await Promise.all( uploadDocumentUrls.map( async (doc, index) => {
                const docResponse = await fetch(doc.url)
                const docData = await docResponse.arrayBuffer();
                await investmentStorageRef.child(`${investmentId}/documents/${doc.name}`).put(docData, metadata)
                const uploadedDocUrl = await investmentStorageRef.child(`${investmentId}/documents/${doc.name}`).getDownloadURL()
                uploadTracker = uploadTracker + 1
                setFilesUploaded(uploadTracker)
                return {url: uploadedDocUrl, name: doc.name}
            }))
        } catch (e) {
            console.log(e)
            setIsUploading(false)
            return
        }

        try {
            const uploadInvestmentUrlsResponse = await fetch(`${currentDomain}/api/uploadInvestmentDocumentsUrls`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    investmentId: investmentId,
                    documents: uploadedDocumentUrls,
                    deal: deal
                })
            })

            const uploadInvestmentUrlsData = await uploadInvestmentUrlsResponse.json()
            console.log(uploadInvestmentUrlsData)


        } catch (e) {
            console.log(e)
            setIsUploading(false)
            return
        }
        setShowUploadDocuments(false)
        setIsUploading(false)
        setFilesUploaded(0)
        initializeInvestmentAdmin(investmentId)
    }

    const paymentSent = async () => {
        setIsLoading(true)
        try {
            const paymentSentResponse = await fetch(`${currentDomain}/api/paymentSent`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    investmentId: investmentId,
                    deal: deal
                })
            })

            const paymentSentData = await paymentSentResponse.json()
            console.log(paymentSentData)
            setShowMakePayment(false)
            initializeInvestmentAdmin(investmentId)
        } catch (e) {
            console.log(e)
            setIsLoading(false)
            return
        }
        
    }
    

    const initializeInvestmentAdmin = async () => {
        setIsLoading(true)
        const initializeInvestmentAdminResponse = await fetch(`${currentDomain}/api/initializeInvestmentAdmin`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                investmentId: investmentId
            })
        })

        const initializeInvestmentAdminData = await initializeInvestmentAdminResponse.json()

        if (initializeInvestmentAdminData.result == "success") {
            setInvestment(initializeInvestmentAdminData.investment)
            setDeal(initializeInvestmentAdminData.deal)
            if (initializeInvestmentAdminData.investment.status != "pending") {
                setDocuments(initializeInvestmentAdminData.deal.documents)
            }
        } else {
            console.log(initializeInvestmentAdminData.result)
        }
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
        setShowAskSponsors(false)
        setIsLoading(false)
    }

    const viewDocument = async (index) => {
        setIsLoading(true)
        const buffer = await pdfBuffer(documents[index].url)
        setIsLoading(false)
        setShowPdfPreview(buffer)
    }

    const viewReport = async (index) => {
        setIsLoading(true)
        const buffer = await pdfBuffer(deal.reports[index].url)
        setIsLoading(false)
        setShowPdfPreview(buffer)
    }

    useEffect(() => {
        const handleResize = () => {
            if (isScreenMobile(window)) {
              router.push('/mobileMessage')
            }
          }
        window.addEventListener("resize", handleResize)
        handleResize()
        if (investmentId) {
            (async () => {
                initializeInvestmentAdmin(investmentId)
            })()
        }
    }, [investmentId])

    return (
        <div className={styles.container}>
            <Head>
            <title>Fruitiion</title>
                <link rel="icon" href="/fruitiionIcon.svg" />
            </Head>                <meta name="description" content="Generated by create next app" />

            <AppContainer
                userType={userType}
                activeSection=''
                secondRowContnet={
                    <>
                    <div className={styles.adminTitleContainer}>
                        <a className={styles.adminTitle}>INVESTMENT ADMIN</a>
                    </div>
                    </>
                }
                appContent={
                    <>
                    <div className={styles.dealDetailContentContainer}>
                        <div className={styles.dealDetailPhotosContainer} onClick={() => setShowGallery(true)}>
                            <Image src={deal ? deal.images[0]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal main photo' className={styles.dealDetailMainPhoto} height={500} width={500} priority/>
                            <div className={styles.dealDetailAlternatePhotosContainer}>
                                <div className={styles.altPhotosRow}>
                                    <Image src={deal ? deal.images[1]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoOne} height={300} width={250}/>
                                    <Image src={deal ? deal.images[2]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoTwo} height={300} width={250}/>
                                </div>
                                <div className={styles.altPhotosRow}>
                                    <Image src={deal ? deal.images[3]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoThree} height={300} width={250}/>
                                    <Image src={deal ? deal.images[4]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoFour} height={300} width={250}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dealDetailGeneralInfoContainer}>
                            <div className={styles.textDetailsContainer}>
                                <a className={styles.dealDetailTitle}>{deal ? deal.nickname : null}</a>
                                <a className={styles.dealDetailInfo}>{deal ? deal.city : null} | {deal ? deal.state : null}</a>
                                <a className={styles.dealDetailInfo}>Investment Amount: {investment ? investment.investmentAmount : null}</a>
                                <a className={styles.dealDetailInfo}>{investment ? investment.status : null}</a>
                            </div>
                            <div className={styles.dealGraphsContainer}>
                                <div className={styles.dealGraphContainer}>
                                    <a className={styles.graphTitle}>Total Raised</a>
                                    <br />
                                    <div className={styles.graphMetricsContainer}>
                                        <a className={styles.graphPrimaryMetrics}>{deal ? deal.raised : null} of {deal ? deal.totalRaise : null}</a>
                                        <a className={styles.graphSecondaryMetrics}>{deal ? calculatePercentage(deal.raised, deal.totalRaise) : null}</a>
                                    </div>
                                    <div className={styles.graphBarEmpty}>
                                        <div className={styles.graphBar} style={{width: deal? calculatePercentage(deal.raised, deal.totalRaise): null}}/>
                                    </div>

                                </div>
                                <div className={styles.dealGraphContainer}>
                                    <a className={styles.graphTitle} style={{color: investment && (investment.status == "Active" || investment.status == "Investment Closed") ? null : "#bdbdbd"}}>{investment && (investment.status == "Active" || investment.status == "Investment Closed") ? "": "Pending "}Equity Ownership</a>
                                    <br />
                                    <div className={styles.graphMetricsContainer}>
                                        <a className={styles.graphPrimaryMetrics} style={{color: investment && (investment.status == "Active" || investment.status == "Investment Closed") ? null : "#bdbdbd"}}>{investment ? `${investment.investmentAmount}`: null} of {deal ? deal.totalRaise : null}</a>
                                        <a className={styles.graphSecondaryMetrics} style={{color: investment && (investment.status == "Active" || investment.status == "Investment Closed") ? null : "#bdbdbd"}}>{deal && investment ? calculatePercentage(investment.investmentAmount, deal.totalRaise) : null}</a>
                                    </div>
                                    <div className={styles.graphBarEmpty}>
                                        <div className={styles.graphBar} style={{width: deal && investment ? calculatePercentage(investment.investmentAmount, deal.totalRaise): null, backgroundColor: investment && (investment.status == "Active" || investment.status == "Investment Closed") ? null : "#ffeb3b"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dealNumbersContainer}>
                            <button className={styles.adminControlButton} onClick={() => window.open(`/dealDetail/${deal._id}`, '_blank', 'noreferrer')}>View Deal</button>
                            {
                                investment && investment.status == "Awaiting Documents" ?
                                <InvestorActionButton title="Upload Documents" onClick={ () => setShowUploadDocuments(true)}/>:
                                null
                            }
                            {
                                investment && investment.status == "Awaiting Payment" ?
                                <InvestorActionButton title="Payment Sent" onClick={ () => setShowMakePayment(true)}/>:
                                null
                            }
                            
                            
                        </div>
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
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => investment && investment.status != "Pending" ? setShowDocuments(!showDocuments) : null}>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Documents</a>
                                    <Image className={styles.toggleArrow} style={showDocuments ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src={investment && investment.status == "Pending" ? "/lockIconGrey.svg": "/rightArrow.svg"}/>
                                </div>
                            </div>
                        </div>
                        {
                            showDocuments ?
                            <div className={styles.dealDetailTableContainer}>
                                <DealDetailDocumentsTable documents={documents}  viewDocument={(index) => viewDocument(index) }/>
                            </div>:
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => investment && (investment.status == "Active" || investment.status == "Investment Closed") ? setShowDistributions(!showDistributions) : null}>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Distributions</a>
                                    <Image className={styles.toggleArrow} style={showDistributions ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src={investment && (investment.status == "Active" || investment.status == "Investment Closed") ?  "/rightArrow.svg": "/lockIconGrey.svg"}/>
                                </div>
                            </div>
                        </div>
                        {
                            showDistributions ?
                            <div className={styles.dealDetailTableContainer}>
                                <DealAdminDistributionTable distributions={deal && deal.distributions ? deal.distributions : []}/>
                            </div>:
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => investment && (investment.status == "Active" || investment.status == "Investment Closed") ? setShowReports(!showReports) : null}>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Reports</a>
                                    <Image className={styles.toggleArrow} style={showReports ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src={investment && (investment.status == "Active" || investment.status == "Investment Closed")  ? "/rightArrow.svg": "/lockIconGrey.svg"}/>
                                </div>
                            </div>
                        </div>
                        {
                            showReports ?
                            <div className={styles.dealDetailTableContainer}>
                                <DealDetailReportsTable documents={deal && deal.reports ? deal.reports : []} viewDocument={(index) => viewReport(index)}/>
                            </div>:
                            null
                        }
                        
                        {
                            showUploadDocuments ?
                            <InvestmentAdminUploadDocuments documents={uploadDocumentUrls} close={() => {setShowUploadDocuments(false), setUploadDocumentUrls([]), setErrorMessage("")}} onDocumentChange={(event) => onDocumentChange(event)} removeDocument={(index)=> removeDocument(index)} submitDocuments={() => uploadInvestmentDocs()} errorMessage={errorMessage}/>:
                            null
                        }
                        {
                            showGallery ? 
                            <Gallery photos={deal ? deal.images: []} previewPhoto={(index) => setPreviewPhoto(deal.images[index])} close={() => setShowGallery(false)}/>:
                            null
                        }
                        {
                            previewPhoto != null ?
                            <PreviewPhoto url={previewPhoto} close={() => setPreviewPhoto()}/>:
                            null
                        }
                        {
                            showRequestExit ?
                            <InvestmentAdminRequestExit close={() => setShowRequestExit(false)}/>:
                            null
                        }
                        {
                            showAskSponsors ?
                            <AskSponsors returnEmail={askReturnEmail} onMessageChange={(message) => setAskMessage(message)} onEmailChange={(email) => setAskReturnEmail(email)} close={() => setShowAskSponsors(false)} sendEmail={() => sendSponsorsMessage()}/>:
                            null
                        }
                        {
                            showMakePayment ?
                            <InvestmentAdminMakePayment nickname={deal.nickname} amount={investment.investmentAmount} equity={calculatePercentage(investment.investmentAmount, deal.totalRaise)} close={() => setShowMakePayment(false)}  paymentSent={() => paymentSent()}/> :
                            null
                        }
                        <div className={styles.bottomSpacer}/>
                    </div>
                    
                    </>
                }
            />
            {
                showPdfPreview ?
                <PdfPreviewModal close={ () => setShowPdfPreview()} url={showPdfPreview}/>:
                null
            }
            {
            isLoading ?
                <FlowLoader />:
                null
            }
            {
                isUploading ?
                <ProgressLoader current={filesUploaded} total={filesToUpload}/>:
                null
            }
            <Footer />
        </div>
    )
  
}


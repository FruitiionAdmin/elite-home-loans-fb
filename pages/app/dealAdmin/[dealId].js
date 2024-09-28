import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import { useState, useEffect } from 'react'
import styles from '../../../styles/Home.module.css'
import AppContainer from '../../../components/AppContainer';
import UserEquityTable from '../../../components/UserEquityTable';
import DealDetailDocumentsTable from '../../../components/DealDetailDocumentsTable';
import DealDetailReportsTable from '../../../components/DealDetailReportsTable';
import DealAdminDistributionTable from '../../../components/DealAdminDistributionsTable';
import ApplicantTable from '../../../components/ApplicantTable';
import Gallery from '../../../components/Gallery';
import PreviewPhoto from '../../../components/PreviewPhoto';
import DealAdminDistribution from '../../../components/DealAdminDistribution';
import DealAdminAddReport from '../../../components/DealAdminAddReport';
import DealAdminConfirmFunded from '../../../components/DealAdminConfirmFundedModal';
import DealAdminCloseDeal from '../../../components/DealAdminCloseDeal';
import DealAdminApplicantReview from '../../../components/DealAdminApplicantReview';
import DealAdminDocumentReview from '../../../components/DealAdminDocumentReview';
import FlowLoader from '../../../components/FlowLoader';
import { currentDomain } from '../../../const';
import PdfPreviewModal from '../../../components/PdfPreviewModal';
import pdfBuffer from '../../../functions/pdfBuffer';
import calculatePercentage from '../../../functions/calculatePercentage';
import { dealStorageRef } from '../../../firebase';
import Footer from '../../../components/FruitiionFooter';
import ConfirmApplicantDecisionModal from '../../../components/ConfirmApplicantDecisionModal';
import ConfirmDocumentDecisionModal from '../../../components/ConfirmDocumentDecisionModal';
import ConfirmPaymentModal from '../../../components/ConfirmPaymentModal';
import ProgressLoader from '../../../components/ProgressLoader';
import isScreenMobile from '../../../functions/isScreenMobile';

export default function DealDetail () {
    
    const router = useRouter()
    const { dealId } = router.query

    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [filesUploaded, setFilesUploaded] = useState(0)
    const [userType, setUserType] = useState("guest")
    
    const [showInvestors, setShowInvestors] = useState(false)
    const [showApplicants, setShowApplicants] = useState(false)
    const [showDocuments, setShowDocuments] = useState(false)
    const [showReports, setShowReports] = useState(false)
    const [showDistributions, setShowDistributions] = useState(false)
    const [showMediaManagement, setShowMediaManagement] = useState(false)
    const [showMakeDistribution, setShowMakeDistribution] = useState(false)
    const [showAddReport, setShowAddReport] = useState(false)
    const [showCloseDeal, setShowCloseDeal] = useState(false)
    const [showApplicantReview, setShowApplicantReview] = useState()
    const [showDocumentsReview, setShowDocumentsReview] = useState()
    const [showDocumentPreview, setShowDocumentPreview] = useState()
    const [showApplicantAlert, setShowApplicantAlert] = useState(false)
    const [decisionConfirmation, setShowDecisionConfirmation] = useState()
    const [documentDecisionConfirmation, setShowDocumentDecisionConfirmation] = useState()
    const [documentDecisionComments, setDocumentDecisionComments] = useState("")
    const [paymentConfirmation, setPaymentConfirmation] = useState()
    const [showConfirmFunded, setShowConfirmFunded] = useState(false)
    

    const [newEquity, setNewEquity] = useState("N/A")

    const [deal, setDeal] = useState()
    const [applicants, setApplicants] = useState([])
    const [investors, setInvestors] = useState([])

    const [adjustedInvestmentAmount, setAdjustedInvestmentAmount] = useState("")
    const [decisionComments, setDecisionComments] = useState("")
    const [distributionAmount, setDistributionAmount] = useState("")
    const [distributionMemo, setDistributionMemo] = useState("")
    const [reportMemo, setReportMemo] = useState("")
    const [confirmFundedMessage,setShowConfirmFundedMessage] = useState("")

    const [newReportUrl, setNewReportUrl] = useState()
    const [reportTitle, setReportTitle] = useState("")

    const [previewPhoto, setPreviewPhoto] = useState()

    const [closeDealMessage, setCloseDealMessage] = useState("")
    

    const onReportChange =  (event) => {
        let report = event.target.files[0]
        const url = URL.createObjectURL(report)
        setNewReportUrl(url)
    }

    const showPreviewPhoto = (index) => {
        let photo = deal.images[index]
        setPreviewPhoto(photo)
    }

    const initializeDealAdmin = async (id) => {
        setIsLoading(true)
        const initializeDealAdminResponse = await fetch(`${currentDomain}/api/initializeDealAdmin`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                dealId: id
            })
        })

        const initializeDealAdminData = await initializeDealAdminResponse.json()
        if (initializeDealAdminData.result == "success") {
            setUserType(initializeDealAdminData.userType)
            setApplicants(initializeDealAdminData.applicants)
            setInvestors(initializeDealAdminData.investors)
            setDeal(initializeDealAdminData.deal)
            setShowApplicantAlert(initializeDealAdminData.applicantAlert)
        } else {
            console.log(initializeDealAdminData.result)
        }

        setIsLoading(false)
    }

    const viewPdf = async (url) => {
        setIsLoading(true)
        const iqsBuffer = await pdfBuffer(url)
        setIsLoading(false)
        setShowDocumentPreview(iqsBuffer)
    }

    const applicantDecision = async (decision, applicant) => {
        console.log(applicant)
        setIsLoading(true)
        const investmentApplicantDecisionResponse = await fetch(`${currentDomain}/api/investmentApplicantDecision`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicant: applicant,
                decision: decision,
                adjustedInvestmentAmount: adjustedInvestmentAmount,
                comments: decisionComments,
                deal:deal
            })
        })

        const investmentApplicantDecisionData = await investmentApplicantDecisionResponse.json()
        console.log(investmentApplicantDecisionData)
        if (investmentApplicantDecisionData.result == "success") {
            initializeDealAdmin(dealId)
        }
        setShowApplicantReview()
        setShowDecisionConfirmation()
        setIsLoading(false)
    }

    const documentDecision = async (decision, applicant) => {
        setIsLoading(true)
        const investmentDocumentDecisionResponse = await fetch(`${currentDomain}/api/investmentDocumentDecision`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicant: applicant,
                decision: decision,
                comments: documentDecisionComments
            })
        })

        const investmentDocumentDecisionData = await investmentDocumentDecisionResponse.json()
        if (investmentDocumentDecisionData.result == "success") {
            initializeDealAdmin(dealId)
        }
        setShowDocumentsReview()
        setShowDocumentDecisionConfirmation()
        setDecisionComments("")
        setIsLoading(false)
    }

    const paymentReceived = async (applicant) => {
        setIsLoading(true)
        const paymentRecievedResponse = await fetch(`${currentDomain}/api/paymentReceived`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                applicant: applicant,
                deal:deal
            })
        })

        const paymentReceivedData = await paymentRecievedResponse.json()

        if (paymentReceivedData.result == "success") {
            initializeDealAdmin(dealId)
        }
        setPaymentConfirmation()
        setIsLoading(false)
    }

    const onAdjustedInvestmentAmountChange = (event) => {
        const rawNumber = event.target.value
        const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const finalValue = formattedValue ? `$${formattedValue}` : "";
        setAdjustedInvestmentAmount(finalValue)

        if (finalValue != "") {
            setNewEquity(calculatePercentage(finalValue,deal.totalRaise))
        } else {
            setNewEquity("N/A")
        }
    }

    const onDistributionAmountChange = (event) => {
        const rawNumber = event.target.value
        const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
        const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        const finalValue = formattedValue ? `$${formattedValue}` : "";
        setDistributionAmount(finalValue)
    }

    const makeDistribution = async () => {
        setIsLoading(true)
        const makeDistributionResponse = await fetch(`${currentDomain}/api/makeDistribution`, {
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                distributionAmount: distributionAmount,
                distributionMemo: distributionMemo,
                deal:deal,
                investors:investors
            })
        })

        const makeDistributionData = await makeDistributionResponse.json()

        if (makeDistributionData.result == "success") {
            initializeDealAdmin(dealId)
            setDistributionAmount("")
            setDistributionMemo("")
            setShowMakeDistribution(false)
        }
        setIsLoading(false)
    }

    const uploadReport = async () => {
        setIsUploading(true)

        let uploadedReportUrl;


        try {
            const metadata = {
                customMetadata: {
                  'secret': process.env.NEXT_PUBLIC_FIREBASE
                }
              };
            const reportResponse = await fetch(newReportUrl)
            const reportData = await reportResponse.arrayBuffer();
            await dealStorageRef.child(`${deal._id}/reports/${reportTitle}`).put(reportData,metadata)
            uploadedReportUrl = await dealStorageRef.child(`${deal._id}/reports/${reportTitle}`).getDownloadURL()
            setFilesUploaded(1)
        } catch (e) {
            console.log(e)
            setIsUploading(false)
            setFilesUploaded(0)
            return
        }

        try {
            const uploadReportResponse = await fetch(`${currentDomain}/api/uploadReport`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deal:deal,
                    url: uploadedReportUrl,
                    name: reportTitle,
                    memo: reportMemo,
                    investors: investors
                })
            })
    
            const uploadReportData = await uploadReportResponse.json()
            console.log(uploadReportData)
            if (uploadReportData.result == "success") {
                initializeDealAdmin(dealId)
                setNewReportUrl("")
                setReportTitle("")
                setShowAddReport(false)
            }
            
        } catch (e) {
            console.log(e)
            setIsUploading(false)
            setFilesUploaded(0)
            return
        }
       
        setIsUploading(false)
        setFilesUploaded(0)
    }

    const closeDeal = async () => {
        setIsLoading(true)

        try {
            const closeDealResponse = await fetch(`${currentDomain}/api/closeDeal`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deal: deal,
                    message: closeDealMessage,
                    investors,
                    applicants
                })
            })
            const closeDealData = await closeDealResponse.json()
            console.log(closeDealData)
        } catch(e) {
            console.log(e)
            setIsLoading(false)
            return
        }
        setCloseDealMessage("")
        setShowCloseDeal(false)
        initializeDealAdmin(dealId)
        setIsLoading(false)
    }

    const funded = async () => {
        setIsLoading(true)

        try {
            const dealFundedResponse = await fetch(`${currentDomain}/api/dealFunded`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    deal: deal,
                    message: confirmFundedMessage,
                    investors,
                    applicants
                })
            })
            const dealFundedData = await dealFundedResponse.json()
            console.log(dealFundedData)
        } catch(e) {
            console.log(e)
            setIsLoading(false)
            return
        }
        setShowConfirmFundedMessage("")
        setShowConfirmFunded(false)
        initializeDealAdmin(dealId)
        setIsLoading(false)
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
                initializeDealAdmin(dealId)
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
                        <a className={styles.adminTitle}>DEAL ADMIN</a>
                    </div>
                    </>
                }
                appContent={
                    <>
                    <div className={styles.dealDetailContentContainer}>
                        <div className={styles.dealDetailPhotosContainer} onClick={() => setShowMediaManagement(true)}>
                            <Image src={deal ? deal.images[0]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg' alt='deal main photo' className={styles.dealDetailMainPhoto} height={500} width={500} priority/>
                            <div className={styles.dealDetailAlternatePhotosContainer}>
                                <div className={styles.altPhotosRow}>
                                    <Image src={deal ? deal.images[1]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoOne} height={300} width={250}/>
                                    <Image src={deal ? deal.images[2]: '/placeholder.svg'} alt='deal alt photo' className={styles.dealDetailAltPhotoTwo} height={300} width={250}/>
                                </div>
                                <div className={styles.altPhotosRow}>
                                    <Image src={deal ? deal.images[3]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoThree} height={300} width={250}/>
                                    <Image src={deal ? deal.images[4]: '/placeholder.svg'} placeholder="blur" blurDataURL='/placeholder.svg'  alt='deal alt photo' className={styles.dealDetailAltPhotoFour} height={300} width={250}/>
                                </div>
                            </div>
                        </div>
                        <div className={styles.dealDetailGeneralInfoContainer}>
                            <div className={styles.textDetailsContainer}>
                                <a className={styles.dealDetailTitle}>{deal ? deal.nickname: null}</a>
                                <a className={styles.dealDetailInfo}>{deal ? `${deal.city} | ${deal.state}`: null}</a>
                                <a className={styles.dealDetailInfo}>Purchase Price: {deal ? deal.purchasePrice: null}</a>
                                <a className={styles.dealDetailInfo}>{deal ? deal.status: null}</a>
                            </div>
                            <div className={styles.dealGraphsContainer}>
                                <div className={styles.dealGraphContainer}>
                                    <a className={styles.graphTitle}>Total Raised</a>
                                    <br />
                                    <div className={styles.graphMetricsContainer}>
                                        <a className={styles.graphPrimaryMetrics}>{deal ? `${deal.raised} of ${deal.totalRaise}`: null}</a>
                                        <a className={styles.graphSecondaryMetrics}>{deal ? calculatePercentage(deal.raised,deal.totalRaise) : null}</a>
                                    </div>
                                    <div className={styles.graphBarEmpty}>
                                        <div className={styles.graphBar} style={deal ? {width:calculatePercentage(deal.raised,deal.totalRaise)}: null}/>
                                    </div>
                                </div>
                                <br />
                                <a className={styles.graphTitle}>Total Distributed: {deal ? deal.distributed : null} </a>
                            </div>
                        </div>
                        <div className={styles.dealNumbersContainer}>
                            <button className={styles.adminControlButton} onClick={() => setShowMediaManagement(true)}>Media</button>
                            { 
                                deal && deal.status != "Pending" ?
                                    <button className={styles.adminControlButton} onClick={() => setShowAddReport(true)}>Add Report</button>:
                                    null
                            }
                            {
                                deal && deal.status == "Active" ?
                                    <button className={styles.adminControlButton} onClick={() => setShowConfirmFunded(true)}>Deal Funded</button>:
                                    null
                            }
                            {
                                deal && deal.status == "Funded" ?
                                    <button className={styles.adminControlButton} onClick={() => setShowMakeDistribution(true)}>Add Distribution</button>:
                                    null
                            }
                            {
                                deal && deal.status != "Closed" ?
                                    <button className={styles.adminControlButton} onClick={() => setShowCloseDeal(true)}>Close Deal</button>:
                                    null
                            }
                            
                        </div>
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() =>setShowInvestors(!showInvestors) }>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Investors</a>
                                    <Image className={styles.toggleArrow} style={showInvestors ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src="/rightArrow.svg"/>
                                </div>
                            </div>
                            
                        </div>
                        {
                            showInvestors ?
                            <div className={styles.dealDetailTableContainer}>
                                <UserEquityTable investors={investors} />
                            </div> :
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => setShowApplicants(!showApplicants) }>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Applicants</a>
                                    
                                    <Image className={styles.toggleArrow} style={showApplicants ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src="/rightArrow.svg"/>
                                    {
                                        showApplicantAlert ?
                                        <div className={styles.inlineAlertContainer}>
                                            <a className={styles.alertText}>!</a>
                                        </div>:
                                        null
                                    }
                                </div>
                            </div>
                            
                        </div>
                        {
                            showApplicants ?
                            <div className={styles.dealDetailTableContainer}>
                                <ApplicantTable applicants={applicants} reviewApp={(index) => setShowApplicantReview(applicants[index])} reviewDocs={(index) => setShowDocumentsReview(applicants[index])} paymentReceived={(index) => setPaymentConfirmation(applicants[index])}/>
                            </div> :
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() =>setShowDistributions(!showDistributions) }>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Distributions</a>
                                    <Image className={styles.toggleArrow} style={showDistributions ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src="/rightArrow.svg"/>
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
                            <div className={styles.dealToggle} onClick={() => setShowReports(!showReports) }>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Reports</a>
                                    <Image className={styles.toggleArrow} style={showReports ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src= "/rightArrow.svg"/>
                                </div>
                            </div>
                        </div>
                        {
                            showReports ?
                            <div className={styles.dealDetailTableContainer}>
                                <DealDetailReportsTable documents={deal && deal.reports ? deal.reports : []} viewDocument={(index) => viewPdf(deal.reports[index].url)}/>
                            </div>:
                            null
                        }
                        <div className={styles.toggleContainer}>
                            <div className={styles.dealToggle} onClick={() => setShowDocuments(!showDocuments) }>
                                <div className={styles.toggleHeaderContainer}>
                                    <a className={styles.toggleText}>Documents</a>
                                    <Image className={styles.toggleArrow} style={showDocuments ? {rotate:'90deg', transition: "rotate 0.5s ease"} : null} alt="toggle collapsable icon" height={25} width={25} src="/rightArrow.svg"/>
                                </div>
                            </div>
                        </div>
                        {
                            showDocuments ?
                            <div className={styles.dealDetailTableContainer}>
                                <DealDetailDocumentsTable documents={deal ? deal.documents: []} viewDocument={(index) => viewPdf(deal.documents[index].url)}/>
                            </div>:
                            null
                        }
                        {
                            showMediaManagement ? 
                            <Gallery photos={deal ? deal.images: []} previewPhoto={(index) => showPreviewPhoto(index)} close={() => setShowMediaManagement(false)}/>:
                            null
                        }
                        {
                            showMakeDistribution ? 
                            <DealAdminDistribution close={() => setShowMakeDistribution(false)} onDistributionChange={(event) => onDistributionAmountChange(event)} distributionAmount={distributionAmount} onDistributionMemoChange={(event) => setDistributionMemo(event.target.value)} distributionMemo={distributionMemo} makeDistribution={() => makeDistribution()}/>:
                            null
                        }
                        {
                            showAddReport ? 
                            <DealAdminAddReport close={() => setShowAddReport(false)} onReportChange={(event) => onReportChange(event)} onReportTitleChange={(event) => setReportTitle(event.target.value)} reportTitle={reportTitle} uploadReport={() => uploadReport()} report={newReportUrl} value={reportMemo} onChange={(event) => setReportMemo(event.target.value)}/>:
                            null
                        }
                        {
                            showCloseDeal ? 
                            <DealAdminCloseDeal closeDeal={() => closeDeal()} close={() => {setShowCloseDeal(false), setCloseDealMessage("")}} value={closeDealMessage} onChange={(event) => setCloseDealMessage(event.target.value)} />:
                            null
                        }
                        {
                            showApplicantReview != null ?
                            <DealAdminApplicantReview adjustedInvestmentAmount={adjustedInvestmentAmount} onAdjustedInvestmentAmountChange={(event) => onAdjustedInvestmentAmountChange(event)} decision={(decision, applicant) => setShowDecisionConfirmation({decision, applicant})} viewIqs={(url) => viewPdf(url)} applicant={showApplicantReview} close={() => {setShowApplicantReview(), setAdjustedInvestmentAmount(""), setNewEquity("N/A")}} decisionComments={decisionComments} onDecisionMessageChange={(event) => setDecisionComments(event.target.value)} equity={calculatePercentage(showApplicantReview.investmentAmount,deal.totalRaise)} newEquity={newEquity} minInvestment={deal.minInvestment} maxInvestment={deal.maxInvestment}/>:
                            null
                        }
                        {
                            showDocumentsReview != null ?
                            <DealAdminDocumentReview applicant={showDocumentsReview} close={() => setShowDocumentsReview()} viewDoc={(url) => viewPdf(url)} documentDecision={(decision, applicant) => setShowDocumentDecisionConfirmation({decision, applicant})}/>:
                            null
                        }
                        {
                            previewPhoto != null ?
                            <PreviewPhoto url={previewPhoto} close={() => setPreviewPhoto()}/>:
                            null
                        }
                        <div className={styles.bottomSpacer}/>
                    </div>
                    
                    </>
                }
            />
            {
                showDocumentPreview ?
                <PdfPreviewModal close={ () => setShowDocumentPreview()} url={showDocumentPreview}/>:
                null
            }
            {
                decisionConfirmation ?
                <ConfirmApplicantDecisionModal close={() => setShowDecisionConfirmation()} decision={(decision, applicant) => applicantDecision(decision, applicant)} decisionInfo={decisionConfirmation}/>:
                null
            }
            {
                documentDecisionConfirmation ?
                <ConfirmDocumentDecisionModal close={() => setShowDocumentDecisionConfirmation()} decision={(decision, applicant) => documentDecision(decision, applicant)} decisionInfo={documentDecisionConfirmation} documentDecisionComments={ (event) => setDocumentDecisionComments(event.target.value)}/>:
                null
            }
            {
                paymentConfirmation ?
                <ConfirmPaymentModal close={() => setPaymentConfirmation()} applicant={paymentConfirmation} confirm={(applicant) => paymentReceived(applicant)}/>:
                null
            }
            {
                showConfirmFunded ?
                <DealAdminConfirmFunded close={() => {setShowConfirmFunded(false), setShowConfirmFundedMessage("")}} applicant={paymentConfirmation} funded={() => funded()} value={confirmFundedMessage} onChange={(event) => setShowConfirmFundedMessage(event.target.value)}/>:
                null
            }
            {
                isLoading ?
                <FlowLoader />:
                null
            }
            {
                isUploading ?
                <ProgressLoader current={filesUploaded} total={1}/>:
                null
            }
            <Footer />
        </div>
    )
  
}


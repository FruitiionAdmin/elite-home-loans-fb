import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import styles from '../../../styles/Home.module.css'
import { useState, useEffect } from 'react'
import FlowLoader from '../../../components/FlowLoader';
import RegistraionInputField from '../../../components/RegistrationInputField';
import FlowSelectMultipleOption from '../../../components/FlowSelectMultipleOption';
import { currentDomain } from '../../../const';
import { investmentStorageRef } from '../../../firebase';
import Footer from '../../../components/FruitiionFooter';
import convertDollarStringToInt from '../../../functions/convertDollarStringToInt';
import isScreenMobile from '../../../functions/isScreenMobile';

export default function NewInvestment() {


  const router = useRouter()
  const { dealId } = router.query

  const [activeSection, setActiveSection] = useState(0)

  const [stocks, setStocks] = useState(false)
  const [bonds, setBonds] = useState(false)
  const [reits,setReits] = useState(false)
  const [business, setBusiness] = useState(false)
  const [realEstate, setRealEstate] = useState(false)
  const [notes, setNotes] = useState(false)
  const [mutualFunds, setMutualFunds] = useState(false)
  const [etfs, setEtfs] = useState(false)
  const [commodities, setCommodities] = useState(false)
  const [stockOptions, setStockOptions] = useState(false)
  const [crypto, setCrypto] = useState(false)
  const [other, setOther] = useState(false)

  const [investmentLength, setInvestmentLength] = useState('How long would you like to invest?')

  const [isLoading, setIsLoading] = useState(false)

  const [iqsUrl, setIqsUrl] = useState("")
  const [networth, setNetworth] = useState("")
  const [income, setIncome] = useState("")
  const [investmentAmount, setInvestmentAmount] = useState("")

  const [distributionSchedule, setDistributionSchedule] = useState("")
  const [minInvestment, setMinInvestment] = useState("")
  const [maxInvestment, setMaxInvestment] = useState("")

  const [error, setError] = useState('')

  const onIqsChange = (event) => {
    const iqs = event.target.files
    const url = URL.createObjectURL(iqs[0])
    setIqsUrl(url)
    setError("")
  }

  const submitInvestment = async () => {
    setIsLoading(true)

    var investmentId
    var uploadedIqs

    try {
      const newInvestmentResponse = await fetch(`${currentDomain}/api/createNewInvestment`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            dealId: dealId,
            networth: networth,
            income: income,
            investmentLength: investmentLength,
            investmentAmount: investmentAmount,
            stocks,
            bonds,
            reits,
            business,
            realEstate,
            notes,
            mutualFunds,
            etfs,
            commodities,
            stockOptions,
            crypto,
            other
  
        })
      })
      const newInvestmentData = await newInvestmentResponse.json()

      if (newInvestmentData.investmentId) {
        investmentId = newInvestmentData.investmentId
      } else {
        setError(newInvestmentData.result)
        return
      }
    } catch (e) {
      console.log(e)
      setError('Database write error.')
      setIsLoading(false)
      return
    }
    

    const metadata = {
      customMetadata: {
        'secret': process.env.NEXT_PUBLIC_FIREBASE
      }
    };

    try {
      const iqsResponse = await fetch(iqsUrl)
      const iqsData = await iqsResponse.arrayBuffer()
      await investmentStorageRef.child(`${investmentId}/iqs.pdf`).put(iqsData,metadata)
      uploadedIqs = await investmentStorageRef.child(`${investmentId}/iqs.pdf`).getDownloadURL()
    } catch (e) {
      console.log(e)
      setError('Storage write error.')
      setIsLoading(false)
      return
    }
    
    try {
      const uploadIqsResponse = await fetch(`${currentDomain}/api/uploadIqsUrl`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          investmentId: investmentId,
          iqs: uploadedIqs
        })
      })

      const uploadIqsData = await uploadIqsResponse.json()

      console.log(uploadIqsData)

    } catch (e) {
      console.log(e)
      setError('URL write error.')
      setIsLoading(false)
      return
    }

    if (error == "") {
      router.push('/app/investments')
    }
    
    setIsLoading(false)
  }

  const onNetworthChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setNetworth(finalValue)
    setError("")
  }

  const onIncomeChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setIncome(finalValue)
    setError("")
  }

  const onInvestmentAmountChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setInvestmentAmount(finalValue)
    setError("")
  }

  const isSafe = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
  // checks if the input contains only alphabets and spaces
    if (text == "") return false
    return regex.test(text);
  }

  const next = () => {
    switch(activeSection) {
      case 0:
        setActiveSection(1)
        break
      case 1:
          if (iqsUrl == "") {
            setError("Must Upload Investor Qualification Statement")
            break
          }
          setActiveSection(2)
          break
        case 2:
          if (networth == "") {
            setError("Invalid Networth")
            break
          }
          if (income == "") {
            setError("Invalid Income")
            break
          }
          setActiveSection(3)
          break
        case 3:
          setActiveSection(4)
          break
        case 4:
          if (investmentLength == "How long would you like to invest?") {
            setError("Please select your desired length of investment")
            break
          }
          setActiveSection(5)
          break
        case 5:
          setActiveSection(6)
          break
        case 6:
          if(investmentAmount == "") {
            setError("Invalid investment amount")
            break
          }
          if (convertDollarStringToInt(investmentAmount) < convertDollarStringToInt(minInvestment)) {
            setError("You must at least invest the minimum investment amount")
            break
          }
          if (convertDollarStringToInt(investmentAmount) > convertDollarStringToInt(maxInvestment)) {
            setError("You cannot invest more than the maximum investment amount")
            break
          }
          submitInvestment()
          break
        default:
          break
    }

  }

  const initializeNewInvestment = async (id) => {
    setIsLoading(true)
    const initializeNewInvestmentResponse = await fetch(`${currentDomain}/api/initializeNewInvestment`, {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId:id
        })
    }) 

    const initializeNewInvestmentData = await initializeNewInvestmentResponse.json()

    if (initializeNewInvestmentData.result == "success") {
      setDistributionSchedule(initializeNewInvestmentData.distributionSchedule)
      setMinInvestment(initializeNewInvestmentData.minInvestment)
      setMaxInvestment(initializeNewInvestmentData.maxInvestment)
    } else {
      console.log(initializeNewInvestmentData)
    }

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
            initializeNewInvestment(dealId)
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
      <div className={styles.registrationContainer}>
        <div className={styles.registrationComponentsContainer}>
          <Image alt='Fruitiion logo' className={styles.registrationLogo} src='/fruitiionBannerBlack.svg' width={600} height={212} />
          <a className={styles.flowErrorMessage}>{error}</a>
          {
            activeSection == 0 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>NEW INVESTMENT</h3>
              <br />
              <a className={styles.instructionText}>This can take about 8-12 minutes.</a>
              <br />
              <a className={styles.instructionText}>We take security and privacy very seriously and will be taking all necessary precaution to protect you and your assets.</a>
              <br />
              <ol className={styles.instructionList}>
                <li className={styles.instructionListItem}>You will need all your &quot;Investor Qualification Statement&quot;.</li>
                <li className={styles.instructionListItem}>You will need your income information.</li>
                <li className={styles.instructionListItem}>Be prepared to answer questions about your experience as an investor.</li>
              </ol>
            </div> : null
          }
          
          {
            activeSection == 1 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>UPLOAD</h3>
              <br />
              <a className={styles.instructionText}>Please provide your Investor Qualification Statement.</a>
              <br />
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>{iqsUrl != "" ? "Investor Qualification Statement Selected" : 'Upload "Investor Qualification Statement" +'}</a>
                    <input onChange={(event) => onIqsChange(event)} type='file' accept='application/pdf' className={styles.registrationFile}  id='iqs' />
                </label>
                <Image className={styles.fileUploadPreview} alt='image review' src='/pdfIcon.svg' height={50} width={50} />
              </div>
              
            </div> : null
          }
          {
            activeSection == 2 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>INCOME INFO</h3>
              
              <div className={styles.registrationNameInfoContainer}>
                <RegistraionInputField placeholder='Current net worth' value={networth} onChange={(event) => onNetworthChange(event)}/>
                <RegistraionInputField placeholder='Current annual income' value={income} onChange={(event) => onIncomeChange(event)}/>
              </div>
            </div> : null
          }
          {
            activeSection == 3 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>INVESTOR EXPERIENCE</h3>
              <div className={styles.investorExperienceContainer}>
                <FlowSelectMultipleOption optionName='Stocks' selected={stocks} toggle={() => setStocks(!stocks)}/>
                <FlowSelectMultipleOption optionName='Bonds' selected={bonds} toggle={() => setBonds(!bonds)}/>
                <FlowSelectMultipleOption optionName='REITs' selected={reits} toggle={() => setReits(!reits)}/>
                <FlowSelectMultipleOption optionName='Business' selected={business} toggle={() => setBusiness(!business)}/>
                <FlowSelectMultipleOption optionName='Real Estate' selected={realEstate} toggle={() => setRealEstate(!realEstate)}/>
                <FlowSelectMultipleOption optionName='Notes' selected={notes} toggle={() => setNotes(!notes)}/>
                <FlowSelectMultipleOption optionName='Mutual Funds' selected={mutualFunds} toggle={() => setMutualFunds(!mutualFunds)}/>
                <FlowSelectMultipleOption optionName='ETFs' selected={etfs} toggle={() => setEtfs(!etfs)}/>
                <FlowSelectMultipleOption optionName='Commodities' selected={commodities} toggle={() => setCommodities(!commodities)}/>
                <FlowSelectMultipleOption optionName='Stock Options' selected={stockOptions} toggle={() => setStockOptions(!stockOptions)}/>
                <FlowSelectMultipleOption optionName='Crypto' selected={crypto} toggle={() => setCrypto(!crypto)}/>
                <FlowSelectMultipleOption optionName='Other' selected={other} toggle={() => setOther(!other)}/>
              </div>
            </div> : null
          }
          {
            activeSection == 4 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>INVESTMENT LENGTH</h3>
              <div className={styles.registrationNameInfoContainer}>
              <div className={styles.registraionInputContainer}>
                  <select value={investmentLength} className={styles.registrationInput} onChange={(event)=> {setInvestmentLength(event.target.value), setError("")}}>
                      <option disabled value='How long would you like to invest?'>How long would you like to invest?</option>
                      <option value='Less than 1 year'>Less than 1 year</option>
                      <option value='1-3 years'>1-3 years</option>
                      <option value='2-5 years'>2-5 years</option>
                      <option value='5-7 years'>5-7 years</option>
                      <option value='7-10 years'>7-10 years</option>
                      <option value='10+ years'>10+ years</option>
                  </select>
              </div>
              </div>
            </div> : null
          }
          {
            activeSection == 5 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>DISTRIBUTION SCHEDULE</h3>
              <br />
              <br/>
              <a className={styles.instructionText}>The sponsor has elected to pay distributions...</a>
              <br />
              <h3 className={styles.intstructionHeader}>{distributionSchedule}</h3>
              <div className={styles.registrationNameInfoContainer}>
              
              </div>
            </div> : null
          }
          {
            activeSection == 6 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>INVESTMENT AMOUNT</h3>
             
              <div className={styles.registrationNameInfoContainer}>
                <RegistraionInputField placeholder='How much would you like to invest?' value={investmentAmount} onChange={(event) => onInvestmentAmountChange(event)}/>
              </div>
              <br />
              <a className={styles.instructionText}>Minimum Investment: {minInvestment}</a>
              <br />
              <a className={styles.instructionText}>Maximum Investment: {maxInvestment}</a>
            </div> : null
          }

          <div className={styles.registrationProgessButtonsContainer}>
            <button className={styles.registrationPreviousButton} onClick={() => activeSection > 0 ? setActiveSection(activeSection - 1) : router.push(`/dealDetail/${dealId}`)}>Previous</button>
            <button className={styles.registrationProgressButton} onClick={() => next()}>{activeSection < 6 ? 'Next' : 'Submit'}</button>
          </div>
        </div>

      </div>
      {
        isLoading ?
        <FlowLoader />:
        null
      }
      <Footer />
    </div>
  )
}

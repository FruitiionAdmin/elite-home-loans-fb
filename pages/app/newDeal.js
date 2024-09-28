import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import styles from '../../styles/Home.module.css'
import { useState, useEffect } from 'react'
import RegistraionInputField from '../../components/RegistrationInputField';
import RegistrationTextArea from '../../components/RegistrationTextArea';
import AdditionalSponsorsTable from '../../components/AdditionalSponsorTable';
import { currentDomain } from '../../const';
import { dealStorageRef } from '../../firebase';
import UploadDocumentsTable from '../../components/UploadDocumentsTable';
import UploadImagesTable from '../../components/UploadPhotosTable';
import Footer from '../../components/FruitiionFooter';
import convertDollarStringToInt from '../../functions/convertDollarStringToInt';
import ProgressLoader from '../../components/ProgressLoader';
import isScreenMobile from '../../functions/isScreenMobile';


export default function NewDeal() {


  const router = useRouter()
  const [activeSection, setActiveSection] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [additionalSponsors, setAdditionalSponsors] = useState([])
  const [documentUrls, setDocumentUrls] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [nickname, setNickname] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [totalRaise, setTotalRaise] = useState("")
  const [minInvestment, setMinInvestment] = useState("")
  const [maxInvestment, setMaxInvestment] = useState("")
  const [projRoi, setProjRoi] = useState("")
  const [investmentType, setInvestmentType] = useState("")
  const [lengthOfDeal, setLengthOfDeal] = useState("")
  const [asName, setAsName] = useState("")
  const [asEmail, setAsEmail] = useState("")
  const [summary, setSummary] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [distributionSchedule, setDistributionSchedule] = useState("Distribution Schedule")

  const [error, setError] = useState('')
  const [filesUploaded, setFilesUploaded] = useState(0)
  const [filesToUpload, setFilesToUpload] = useState(0)

  const onDocumentChange = (event) => {
    setError("")
    const documents = event.target.files
    const length = documents.length
    for (let docIndex = 0; docIndex < length; docIndex++) {
      const url = URL.createObjectURL(documents[docIndex])
      setDocumentUrls(documentUrls => [...documentUrls,{url, name: documents[docIndex].name}])
    }
  }

  const onImageChange = (event) => {
    setError("")
    const images = event.target.files
    const length = images.length
    for (let imageIndex = 0; imageIndex < length; imageIndex++) {
      const url = URL.createObjectURL(images[imageIndex])
      setImageUrls(imageUrls => [...imageUrls,url])
    }
  }

  const onPurchasePriceChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setPurchasePrice(finalValue)
    setError("")
  }

  const onTotalRaiseChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setTotalRaise(finalValue)
    setError("")
  }

  const onMinInvestmentChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setMinInvestment(finalValue)
    setError("")
  }

  const onMaxInvestmentChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const finalValue = formattedValue ? `$${formattedValue}` : "";
    setMaxInvestment(finalValue)
    setError("")
  }

  const onProjRoiChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    setProjRoi(cleanedValue)
    setError("")
  }

  const onLengthOfDealChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/[^0-9.]/g, '');
    setLengthOfDeal(cleanedValue)
    setError("")
  }

  const addSponsor = () => {
    let currentSponsors = additionalSponsors
    currentSponsors.push([asName,asEmail])
    setAdditionalSponsors(currentSponsors)
    setAsName("")
    setAsEmail("")
  }

  const removeSponsor = (index) => {
    let currentSponsors = additionalSponsors
  
    // Create a new array without the item at the specified index
    const newArray = [...currentSponsors.slice(0, index), ...currentSponsors.slice(index + 1)];
    setAdditionalSponsors(newArray)
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
          if (documentUrls.length == 0) {
            setError("Must Upload Deal Documents")
            break
          }
          setActiveSection(2)
          break
        case 2:
          if (imageUrls.length < 5) {
            setError("Must Upload at least 5 photos")
            break
          }
          setActiveSection(3)
          break
        case 3:
          if (nickname == "") {
            setError("Invalid Nickname")
            break
          }
          if (purchasePrice.length < 2 || convertDollarStringToInt(purchasePrice) < 100) {
            setError("Invalid Purchase Price")
            break
          }
          if (totalRaise.length < 2 || convertDollarStringToInt(totalRaise) < 100) {
            setError("Invalid Total Raise")
            break
          }
          if (city == "") {
            setError("City Required")
            break
          }
          if (state == "") {
            setError("State Required")
            break
          }
          setActiveSection(4)
          break
        case 4:
          if (minInvestment.length < 2 || convertDollarStringToInt(minInvestment) < 100) {
            setError("Invalid Minimum Investment")
            break
          }
          if (maxInvestment.length < 2 || convertDollarStringToInt(maxInvestment) < 100) {
            setError("Invalid Maximum Investment")
            break
          }
          if (convertDollarStringToInt(maxInvestment) < convertDollarStringToInt(minInvestment)) {
            setError("Maximum Investment cannot be less than Minimum Investment")
            break
          }
          if (projRoi == "") {
            setError("Invalid Projected ROI")
            break
          }
          if (investmentType == "") {
            setError("Invalid Investment Type")
            break
          }
          if (lengthOfDeal == "") {
            setError("Invalid Length of deal")
            break
          }
          if (distributionSchedule == "Distribution Schedule") {
            setError("Please select a distribution Schedule")
            break
          }
          setActiveSection(5)
          break
        case 5:
          if (summary.length < 10) {
            setError("Please provide a summary of your deal")
            break
          }
          submiteDeal()
          break
        default:
          break
    }

  }

  const submiteDeal = async () => {
    setIsUploading(true)
    setFilesToUpload(imageUrls.length + documentUrls.length)
    var dealId
    var uploadedDocumentUrls = []
    var uploadedImageUrls = []
    let uploadTracker = filesUploaded

    try {
      const createDealResponse = await fetch(`${currentDomain}/api/createNewDeal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname:nickname,
          minInvestment: minInvestment,
          maxInvestment: maxInvestment,
          projRoi: projRoi,
          investmentType: investmentType,
          lengthOfDeal: lengthOfDeal,
          summary: summary,
          sponsors: additionalSponsors,
          purchasePrice: purchasePrice,
          totalRaise: totalRaise,
          city: city,
          state: state,
          distributionSchedule: distributionSchedule
        })
      })

      const createDealData = await createDealResponse.json()
      

      if (createDealData.dealId) {
        dealId = createDealData.dealId
      } else {
        setError(createDealData.result)
        return
      }

    } catch (e) {
      console.log(e)
      setError('Database write error.')
      setIsUploading(false)
      return
    }

    try {
      const metadata = {
        customMetadata: {
          'secret': process.env.NEXT_PUBLIC_FIREBASE
        }
      };
      uploadedDocumentUrls = await Promise.all( documentUrls.map( async (doc, index) => {
        const docResponse = await fetch(doc.url)
        const docData = await docResponse.arrayBuffer();
        const task = await dealStorageRef.child(`${dealId}/documents/${doc.name}`).put(docData,metadata)
        const uploadedDocUrl = await dealStorageRef.child(`${dealId}/documents/${doc.name}`).getDownloadURL()
        uploadTracker = uploadTracker + 1
        setFilesUploaded(uploadTracker)
        return {url: uploadedDocUrl, name: doc.name}
      }))

      uploadedImageUrls = await Promise.all( imageUrls.map( async (url, index) => {
        const imageResponse = await fetch(url)
        const imageData = await imageResponse.arrayBuffer();
        const task = await dealStorageRef.child(`${dealId}/images/${index}.png`).put(imageData,metadata)
        const uploadedImageUrl = await dealStorageRef.child(`${dealId}/images/${index}.png`).getDownloadURL()
        uploadTracker = uploadTracker + 1
        setFilesUploaded(uploadTracker)
        return uploadedImageUrl
      }))

    } catch (e) {
      console.log(e)
      setError('Storage write error.')
      setIsUploading(false)
      return
    }

    try {
      const uploadDealUrlsResponse = await fetch(`${currentDomain}/api/uploadDealUrls`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId: dealId,
          documents: uploadedDocumentUrls,
          images: uploadedImageUrls
        })
      })

      const uploadDealUrlsData = await uploadDealUrlsResponse.json()

    } catch (e) {
      console.log(e)
      setError('URL write error.')
      setIsUploading(false)
      return
    }

    if (error == "") {
      router.push('/app/deals')
    }

    setIsUploading(false)
  }

  const removeDocument = (index) => {
    let currentDocs = documentUrls

    if (currentDocs.length > 0 ) {
      // Create a new array without the item at the specified index
      const newArray = [...currentDocs.slice(0, index), ...currentDocs.slice(index + 1)];
      setDocumentUrls(newArray)
    }
  }

  const removeImage = (index) => {
    let currentImages = imageUrls
  
    // Create a new array without the item at the specified index
    if (currentImages.length > 0) {
      const newArray = [...currentImages.slice(0, index), ...currentImages.slice(index + 1)];
      setImageUrls(newArray)
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
  }, [])


  return (
    <div className={styles.container}>
      <Head>
        <title>Fruitiion</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/fruitiionIcon.svg" />
      </Head>
      <div className={styles.registrationContainer}>
        <div className={styles.registrationComponentsContainer}>
          <Image alt='Fruitiion logo' className={styles.registrationLogo} src='/fruitiionBannerBlack.svg' width={303} height={106} />
          <a className={styles.flowErrorMessage}>{error}</a>
          {
            activeSection == 0 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>NEW DEAL</h3>
              <br />
              <a className={styles.instructionText}>This can take about 8-12 minutes.</a>
              <br />
              <a className={styles.instructionText}>We take security and privacy very seriously and will be taking all necessary precaution to protect you and your assets.</a>
              <br />
              <ol className={styles.instructionList}>
                <li className={styles.instructionListItem}>You will need all your &quot;Deal Documents&quot;. (PPM, Business plan, ETC.)</li>
                <li className={styles.instructionListItem}>You will need all your &quot;Deal Media&quot;. (Photos and Videos)</li>
              </ol>
              <br />
              <br />
              <a className={styles.instructionText}>We recommend creating a folder that has two sub folders, one for documents and one for media. This will help ensure all files required to list the deal are uploaded properly. </a>
              <br />
            </div> : null
          }
          
          {
            activeSection == 1 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>UPLOAD DOCUMENTS</h3>
              <br />
              <a className={styles.instructionText}>Please provide the documents for your new deal.</a>
              <br />
              <a className={styles.instructionText}>Please be sure to include the following documents.</a>
              <br />
              <p className={styles.instructionList}>1. PPM</p>
              <p className={styles.instructionList}>2. EDGAR filings</p>
              <p className={styles.instructionList}>3. Bad Actor Questionaire</p>
              <p className={styles.instructionList}>4. Business Plan</p>
              <p className={styles.instructionList}>5. Company Agreement</p>
              <p className={styles.instructionList}>6. Subscription Documents</p>
              <p className={styles.instructionList}>7. Marketing Deck</p>
              <br/>
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>+ Upload Deal Documents</a>
                    <input onChange={(event) => onDocumentChange(event)} multiple type='file' accept='application/pdf' className={styles.registrationFile}  id='documents' />
                </label>
                <UploadDocumentsTable documents={documentUrls} removeDocument={(index) => removeDocument(index) }/>
              </div>
            </div> : null
          }
          {
            activeSection == 2 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>UPLOAD PHOTOS</h3>
              <br />
              <a className={styles.instructionText}>Please provide the images for your new deal. The maximum size for each photo is 5gb</a>
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>+ Upload Deal Photos</a>
                    <input onChange={(event) => onImageChange(event)} multiple type='file' accept='image/*' className={styles.registrationFile}  id='dealPhotos' />
                </label>
                <UploadImagesTable images={imageUrls} removeImage={(index) => removeImage(index)}/>
              </div>
            </div> : null
          }
          {
            activeSection == 3 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>DEAL INFO</h3>
  
              <br />
              <RegistraionInputField value={nickname} onChange={(event) => {setNickname(event.target.value), setError("")}} placeholder='Nickname'/>
              <RegistraionInputField value={purchasePrice} onChange={(event) => onPurchasePriceChange(event)} placeholder='Purchase Price'/>
              <RegistraionInputField value={totalRaise} onChange={(event) => onTotalRaiseChange(event)} placeholder='Total Raise'/>
              <RegistraionInputField value={city} onChange={(event) => setCity(event.target.value)} placeholder='City'/>
              <RegistraionInputField value={state} onChange={(event) => setState(event.target.value)} placeholder='State'/>
            </div> : null
          }
          {
            activeSection == 4 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>INVESTMENT INFO</h3>
  
              <br />
              <RegistraionInputField value={minInvestment} onChange={(event) => onMinInvestmentChange(event)} placeholder='Minimum Investment'/>
              <RegistraionInputField value={maxInvestment} onChange={(event) => onMaxInvestmentChange(event)} placeholder='Maximum Investment'/>
              <RegistraionInputField value={projRoi} onChange={(event) => onProjRoiChange(event)} placeholder='Projected ROI (%)'/>
              <RegistraionInputField value={investmentType} onChange={(event) => {setInvestmentType(event.target.value), setError("")}} placeholder='Investment Type'/>
              <RegistraionInputField value={lengthOfDeal} onChange={(event) => onLengthOfDealChange(event)} placeholder='Length of deal (in months)'/>
              <div className={styles.registraionInputContainer}>
                  <select value={distributionSchedule} className={styles.registrationInput} onChange={(event)=> {setDistributionSchedule(event.target.value), setError("")}}>
                      <option disabled value='Distribution Schedule'>Distribution Schedule</option>
                      <option value='Monthly'>Monthly</option>
                      <option value='Quarterly'>Quarterly</option>
                      <option value='Semi-Annually'>Semi-Annually</option>
                      <option value='Annually'>Annually</option>
                  </select>
              </div>
            </div> : null
          }
          {
            activeSection == 5 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>SUMMARY</h3>
              <br />
              <a className={styles.instructionText}>Please add a 3-5 sentence summary of the deal below.</a>
              <br />
              <RegistrationTextArea placeholder='Summary' value={summary} onChange={(event)=> {setSummary(event.target.value), setError("")}}/>
            </div> : null
          }
    

          <div className={styles.registrationProgessButtonsContainer}>
            <button className={styles.registrationPreviousButton} onClick={() => activeSection == 0 ? router.push('/app/deals') : setActiveSection(activeSection - 1)}>Previous</button>
            <button className={styles.registrationProgressButton} onClick={() => next()}>{activeSection < 5 ? 'Next' : 'Submit'}</button>
          </div>
        </div>

      </div>
      {
        isUploading ?
        <ProgressLoader current={filesUploaded} total={filesToUpload}/>:
        null
      }
      <Footer />
    </div>
  )
}

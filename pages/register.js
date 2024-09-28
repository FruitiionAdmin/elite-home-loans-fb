import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import RegistraionInputField from '../components/RegistrationInputField';
import generateSelfieString from '../functions/generateSelfieString';
import { investorStorageRef } from '../firebase';
import { currentDomain } from '../const';
import RegistrationInputWithIcon from '../components/RegistrationInputWithIcon';
import Footer from '../components/FruitiionFooter';
import ProgressLoader from '../components/ProgressLoader';
import isScreenMobile from '../functions/isScreenMobile';


export default function Register() {


  const router = useRouter()
  const [activeSection, setActiveSection] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [filesUploaded, setFilesUploaded] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [middleInitial, setMiddleInitial] = useState('')
  const [lastName, setLastName] = useState('')
  const [suffix, setSuffix] = useState('Suffix')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [frontIdUrl, setFrontIdUrl] = useState()
  const [backIdUrl, setBackIdUrl] = useState()
  const [selfieUrl, setSelfieUrl] = useState()
  const [w9Url, setW9Url] = useState()
  const [profilePictureUrl, setProfilePictureUrl] = useState()
  const [selfieCode, setSelfieCode] = useState()
  const [error, setError] = useState('')

  const emailOnChange = (event) => {
    setEmail(event.target.value)
    setError('')
  }

  const passwordOnChange = (event) => {
    setPassword(event.target.value)
    setError('')
  }

  const confirmPasswordOnChange = (event) => {
    setConfirmPassword(event.target.value)
    setError('')
  }

  const firstNameOnChange = (event) => {
    setFirstName(event.target.value)
    setError('')
  }

  const middleInitialOnChange = (event) => {
    setMiddleInitial(event.target.value)
    setError('')
  }

  const lastNameOnChange = (event) => {
    setLastName(event.target.value)
    setError('')
  }

  const suffixOncChange = (event) => {
    setSuffix(event.target.value)
    setError('')
  }

  const phoneNumberOnChange = (event) => {
    const rawNumber = event.target.value
    const cleanedValue = rawNumber.replace(/\D/g, '');
    const formattedValue = cleanedValue.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    setPhoneNumber(formattedValue);
    setError('')
  }
  
  const onFrontIdChange = (event) => {
    setError('')
    const url = URL.createObjectURL(event.target.files[0])
    setFrontIdUrl(url)
  }

  const onBackIdChange = (event) => {
    setError('')
    const url = URL.createObjectURL(event.target.files[0])
    setBackIdUrl(url)
  }

  const onW9Change = (event) => {
    setError('')
    const url = URL.createObjectURL(event.target.files[0])
    setW9Url(url)
  }

  const selfieOnChange = (event) => {
    setError('')
    const url = URL.createObjectURL(event.target.files[0])
    setSelfieUrl(url)
  }

  const profileOnChange = (event) => {
    setError('')
    const url = URL.createObjectURL(event.target.files[0])
    setProfilePictureUrl(url)
  }

  const isEmailValid = () => {
    // Define a regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the regex and return the result
    return emailRegex.test(email);
  }

  const isSafe = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
  // checks if the input contains only alphabets and spaces
    if (text == "") return false
    return regex.test(text);
  }

  const isValidPhoneNumber = (text) => {
    if (text == "" || text.length < 14) return false
    return true
  }

  const isMiddleSafe = (text) => {
    const regex = /^[a-zA-Z\s]*$/;
  // checks if the input contains only alphabets and spaces
    return regex.test(text);
  }

  const prev = () => {
    if (activeSection != 0) {
      setActiveSection(activeSection - 1)
    }
  }

  const next = () => {
    switch(activeSection) {
      case 0:
        setActiveSection(1)
        break
      case 1:
          if (!isEmailValid()) {
            setError("Invalid Email")
            break
          }
          if (password.length < 6) {
            setError("Passwords must be at least 6 characters")
            break
          }
          if (password != confirmPassword) {
            setError("Passwords do not match")
            break
          }
          if (!isSafe(firstName)) {
            setError("Invalid First Name")
            break
          }
          if (!isMiddleSafe(middleInitial)) {
            setError("Invalid Middle Initial")
            break
          }
          if (!isSafe(lastName)) {
            setError("Invalid Last Name")
            break
          }
          if (!isValidPhoneNumber(phoneNumber)) {
            setError("Invalid Phone Number")
            break
          }
          setActiveSection(2)
          break
        case 2:
          if (frontIdUrl == null || backIdUrl == null) {
            setError("ID Required")
            break
          }
          setActiveSection(3)
          break
        case 3:
          if (w9Url == null) {
            setError("W9 required")
            break
          }
          setActiveSection(4)
          break
        case 4:
          if (profilePictureUrl == null) {
            setError("Profile Picture Required")
            break
          }
          submitApplication()
          break
        default:
          break
    }

  }

  const submitApplication = async () => {
    setIsLoading(true)
    
    var investorId;
    var uploadedFrontId;
    var uploadedBackId;
    var uploadedSelfie;
    var uploadedProfilePicture;
    var uploadedW9

    try {
      const createUserResponse = await fetch(`${currentDomain}/api/createInvestor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName:firstName,
          lastName: lastName,
          middleInitial: middleInitial,
          suffix: suffix,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
          selfieCode: selfieCode
        })
      })
      const createUserData = await createUserResponse.json()
      if (createUserData.investorId) {
        investorId = createUserData.investorId
      } else {
        setError(createUserData.message)
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
      
      const frontIdResponse = await fetch(frontIdUrl)
      const frontIdData = await frontIdResponse.arrayBuffer()
      await investorStorageRef.child(`${investorId}/frontId.png`).put(frontIdData,metadata)
      uploadedFrontId = await investorStorageRef.child(`${investorId}/frontId.png`).getDownloadURL()
      setFilesUploaded(1)
      
      const backIdResponse = await fetch(backIdUrl)
      const backIdData = await backIdResponse.arrayBuffer()
      await investorStorageRef.child(`${investorId}/backId.png`).put(backIdData,metadata)
      uploadedBackId = await investorStorageRef.child(`${investorId}/backId.png`).getDownloadURL()
      setFilesUploaded(2)

      const selfieResponse = await fetch(selfieUrl)
      const selfieData = await selfieResponse.arrayBuffer()
      await investorStorageRef.child(`${investorId}/selfie.png`).put(selfieData,metadata)
      uploadedSelfie = await investorStorageRef.child(`${investorId}/selfie.png`).getDownloadURL()
      setFilesUploaded(3)

      const profilePictureResponse = await fetch(profilePictureUrl)
      const profilePictureData = await profilePictureResponse.arrayBuffer()
      await investorStorageRef.child(`${investorId}/profilePicture.png`).put(profilePictureData,metadata)
      uploadedProfilePicture = await investorStorageRef.child(`${investorId}/profilePicture.png`).getDownloadURL()
      setFilesUploaded(4)
      
      const w9Response = await fetch(w9Url)
      const w9Data = await w9Response.arrayBuffer()
      await investorStorageRef.child(`${investorId}/w9.pdf`).put(w9Data, metadata)
      uploadedW9 = await investorStorageRef.child(`${investorId}/w9.pdf`).getDownloadURL()
      setFilesUploaded(5)

    } catch (e) {
      console.log(e)
      setError('Storage write error.')
      setIsLoading(false)
      return
    }

    try {
      const uploadInvestorUrlsResponse = await fetch(`${currentDomain}/api/uploadInvestorUrls`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: investorId,
          frontId: uploadedFrontId,
          backId: uploadedBackId,
          selfie: uploadedSelfie,
          profilePicture: uploadedProfilePicture,
          w9: uploadedW9
        })
      })
      const uploadedInvestorUrlData = await uploadInvestorUrlsResponse.json()
      console.log(uploadedInvestorUrlData)
    } catch (e) {
      console.log(e)
      setError('URL write error.')
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    if (error == "") {
      router.push('/investorLogin')
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (isScreenMobile(window)) {
        router.push('mobileMessage')
      }
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    setSelfieCode(generateSelfieString())
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
              <h3 className={styles.intstructionHeader}>BEFORE YOU REGISTER</h3>
              <br />
              <a className={styles.instructionText}>This will take about 8-12 minutes.</a>
              <br />
              <a className={styles.instructionText}>We take security and privacy very seriously and will be taking all necessary precaution to protect you and your assets.</a>
              <br />
              <ol className={styles.instructionList}>
                <li className={styles.instructionListItem}>You will need a government issued ID.</li>
                <li className={styles.instructionListItem}>You will need your signed digital W9</li>
              </ol>
            </div> : null
          }
          {
            activeSection == 1 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>PERSONAL INFO</h3>
              <div className={styles.registrationNameInfoContainer}>
                <RegistrationInputWithIcon value={email} onChange={(event) => emailOnChange(event)} autocomplete='current-email' placeholder='Email' leadingIcon='/userIconDark.svg' showPassword={true}/>
                <RegistrationInputWithIcon value={password} onChange={(event) => passwordOnChange(event)} autocomplete='current-passowrd' placeholder='Password' leadingIcon='/lockIconGrey.svg' trailingIcon={showPassword ? '/slashEyeIcon.svg' : '/eyeIcon.svg'} togglePwVis={() => setShowPassword(!showPassword)} showPassword={showPassword}/>
                <RegistrationInputWithIcon value={confirmPassword} onChange={(event) => confirmPasswordOnChange(event)} autocomplete='current-passowrd' placeholder='Confirm Password' leadingIcon='/lockIconGrey.svg' trailingIcon={showPassword ? '/slashEyeIcon.svg' : '/eyeIcon.svg'} togglePwVis={() => setShowPassword(!showPassword)} showPassword={showPassword}/>
                <RegistraionInputField value={firstName} onChange={(event) => firstNameOnChange(event)} placeholder='First Name'/>
                <RegistraionInputField value={middleInitial} onChange={(event) => middleInitialOnChange(event)} placeholder='Middle Initial'/>
                <RegistraionInputField value={lastName} onChange={(event) => lastNameOnChange(event)} placeholder='Last Name'/>
                
                <div className={styles.registraionInputContainer}>
                  <select value={suffix} className={styles.registrationInput} onChange={(event) => suffixOncChange(event)}>
                      <option disabled value='Suffix'>Suffix</option>
                      <option value='Mr'>Mr</option>
                      <option value='Ms'>Ms</option>
                      <option value='Mrs'>Mrs</option>
                      <option value='None'>None</option>
                  </select>
                </div>
                <RegistraionInputField value={phoneNumber} onChange={(event) => phoneNumberOnChange(event)} placeholder='Phone Number'/>
              </div>
            </div> : null
          }
          {
            activeSection == 2 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>ID UPLOAD</h3>
              <br />
              <a className={styles.instructionText}>Please provide a government issued ID. Acceptable forms of identification include a photo of a valid driver’s license or passport.</a>
              <br />
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>Upload Front ID +</a>
                    <input type='file' accept='image/*' className={styles.registrationFile}  id='frontId' onChange={(event) => onFrontIdChange(event)}/>
                </label>
                <Image className={styles.fileUploadPreview} alt='image review' src={ frontIdUrl ? frontIdUrl: '/frontId.svg'} height={50} width={50} />
              </div>
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>Upload Back ID +</a>
                    <input type='file' accept='image/*' className={styles.registrationFile}  id='backId' onChange={(event) => onBackIdChange(event)} />
                </label>
                <Image className={styles.fileUploadPreview} alt='image review' src={ backIdUrl ? backIdUrl: '/backId.svg'}  height={50} width={50} />
              </div>
            </div> : null
          }
          {
            activeSection == 3 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>W9 UPLOAD</h3>
              <br />
              <a className={styles.instructionText}>Please provide your W9</a>
              <br />
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>Upload W9 +</a>
                    <input type='file' accept='image/*,application/pdf' className={styles.registrationFile}  id='w9'  onChange={(event) => onW9Change(event)} />
                </label>
                <iframe className={styles.fileUploadPreview} alt='image review' src={w9Url}  />
              </div>
              
            </div> : null
          }
          {
            activeSection == 4 ? 
            <div className={styles.registrationStepContainer}>
              <h3 className={styles.intstructionHeader}>PROFILE PICTURE UPLOAD</h3>
              <br />
              <a className={styles.instructionText}>Please select a photo that will be used as your profile picure.</a>
              <br />
              <div className={styles.registrationFileContainer}>
                <label className={styles.registraionInputFileContainer}>
                    <a className={styles.registrationFileDisplay}>Upload Picture +</a>
                    <input type='file' accept='image/*,application/pdf' className={styles.registrationFile}  id='selfie'  onChange={(event) => profileOnChange(event)}/>
                </label>
                <Image className={styles.fileUploadPreview} alt='image review' src={profilePictureUrl ? profilePictureUrl: '/userIconBlack.svg'} height={50} width={50} />
              </div>
              
            </div> : null
          }

          <div className={styles.registrationProgessButtonsContainer}>
            <button className={styles.registrationPreviousButton} onClick={() => activeSection == 0 ? router.push('/') : prev()}>Previous</button>
            <button className={styles.registrationProgressButton} onClick={() => next()}>{activeSection < 4 ? 'Next' : 'Submit'}</button>
          </div>
        </div>

      </div>
      {
        isLoading ?
        <ProgressLoader current={filesUploaded} total={4}/>:
        null
      }
      <Footer />
    </div>
  )
}

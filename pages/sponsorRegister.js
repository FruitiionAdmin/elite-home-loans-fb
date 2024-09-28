import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router';
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react'
import RegistraionInputField from '../components/RegistrationInputField';
import RegistrationTextArea from '../components/RegistrationTextArea';
import RegistrationInputWithIcon from '../components/RegistrationInputWithIcon';
import { sponsorStorageRef } from '../firebase';
import { currentDomain } from '../const';
import Footer from '../components/FruitiionFooter';
import ProgressLoader from '../components/ProgressLoader';
import isScreenMobile from '../functions/isScreenMobile';

export default function SponsorRegister() {


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
  const [experience, setExperience] = useState('')
  const [selfieUrl, setSelfieUrl] = useState()
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

  const experienceOnChange = (event) => {
    setError('')
    setExperience(event.target.value)
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

  const isParagraphSafe = (text) => {
    const regex = /^[A-Za-z0-9_.,\s]+$/;
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
          if (experience.length < 10) {
            setError("Please provide a little more details.")
            break
          }
          setActiveSection(3)
          break
        case 3:
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
    
    var sponsorId;
    var uploadedFrontId;
    var uploadedBackId;
    var uploadedSelfie;
    var uploadedProfilePicture;

    try {
      const createUserResponse = await fetch(`${currentDomain}/api/createSponsor`, {
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
          experience: experience,
          selfieCode: selfieCode
        })
      })
      const createUserData = await createUserResponse.json()

      console.log(createUserData)

      

      if (createUserData.sponsorId) {
        sponsorId = createUserData.sponsorId
      } else {
        console.log("called bruh")
        setError(createUserData.message)
        setIsLoading(false)
        return
      }
      
    } catch (e) {
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
      console.log("attempting to upload pic to storage")
      const profilePictureResponse = await fetch(profilePictureUrl)
      const profilePictureData = await profilePictureResponse.arrayBuffer()
      await sponsorStorageRef.child(`${sponsorId}/profilePicture.png`).put(profilePictureData, metadata)
      uploadedProfilePicture = await sponsorStorageRef.child(`${sponsorId}/profilePicture.png`).getDownloadURL()
      setFilesUploaded(1)
      
    } catch (e) {
      console.log(e)
      setError('Storage write error.')
      setIsLoading(false)
      return
    }

    try {
      console.log("attempting to upload URL to db")
      const uploadSponsorUrlsResponse = await fetch(`${currentDomain}/api/uploadSponsorUrls`, {
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: sponsorId,
          profilePicture: uploadedProfilePicture
        })
      })
    } catch (e) {
      setError('URL write error.')
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    if (error == "") {
      router.push('/')
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
              <a className={styles.instructionText}>We take security and privacy very seriously and will be taking all necessary precaution to protect you and your assets.</a>
              <br />
              <ol className={styles.instructionList}>
                <li className={styles.instructionListItem}>You will need a government issued ID.</li>
                <li className={styles.instructionListItem}>You will need your signed digital W9</li>
                <li className={styles.instructionListItem}>You will need a writing utensil and a piece of paper.</li>
                <li className={styles.instructionListItem}>You will need to be able to take a selfie.</li>
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
              <h3 className={styles.intstructionHeader}>SPONSOR INFO</h3>
              <br />
              <a className={styles.instructionText}>Please provide 1-2 paragraphs that speaks on your education, designations experience and other details you may think are relevant to being a Sponsor.</a>
              <br />
              <RegistrationTextArea value={experience} placeholder='Education, Designations, Experience, ETC...' onChange={(event) => experienceOnChange(event)}/>
              
            </div> : null
          }
          {
            activeSection ==  3? 
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
            <button hidden={activeSection == 0} className={styles.registrationPreviousButton} onClick={() => prev()}>Previous</button>
            <button className={styles.registrationProgressButton} onClick={() => next()}>{activeSection < 3 ? 'Next' : 'Submit'}</button>
          </div>
        </div>

      </div>
      {
        isLoading ?
        <ProgressLoader current={filesUploaded} total={1}/>:
        null
      }
      <Footer />
    </div>
  )
}

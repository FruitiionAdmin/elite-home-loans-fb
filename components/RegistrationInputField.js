import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { useState } from 'react'


const RegistraionInputField = (props) => {
    const [isPrivate, setIsPrivate] = useState(false)
    return (
        <div className={styles.registraionInputContainer}>
            <input value={props.value} onChange={ (event) => props.onChange(event)} type={isPrivate ? 'password' : 'none'} className={styles.registrationInput} placeholder={props.placeholder}/>
            {props.trailingIcon != null ? <Image alt='input icon' className={styles.leadingInputIcon} src='../public/eyeIcon.png' width={24} height={24} onClick={() => setIsPrivate(!isPrivate)}/> : null}
        </div>
    )
    
}

export default RegistraionInputField
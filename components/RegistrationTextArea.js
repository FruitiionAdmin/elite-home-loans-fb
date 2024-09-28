import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { useState } from 'react'


const RegistrationTextArea = (props) => {
    const [isPrivate, setIsPrivate] = useState(false)
    return (
        <div className={styles.registraionTextAreaContainer}>
            <textarea value={props.value} className={styles.registrationTextArea} placeholder={props.placeholder} onChange={(event) => props.onChange(event)}/>
        </div>
    )
    
}

export default RegistrationTextArea
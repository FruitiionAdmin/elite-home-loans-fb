import styles from '../styles/Home.module.css'
import Image from 'next/image'


const RegistrationInputWithIcon = (props) => {

    return (
        <div className={styles.registraionInputWithIconContainer}>
            <Image alt='input icon' className={styles.leadingInputIcon} src={props.leadingIcon} width={24} height={24}/>
            <input value={props.value} onChange={(event) => props.onChange(event)} autoComplete={props.autocomplete} type={props.showPassword ? 'none' : 'password'} className={styles.registrationInput} placeholder={props.placeholder}/>
            {props.trailingIcon != null ? <Image alt='input icon' className={styles.trailingInputIcon} src={props.trailingIcon} width={24} height={24} onClick={() => props.togglePwVis()}/> : null}
        </div>
    )
    
}

export default RegistrationInputWithIcon
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import { useState } from 'react'


const FlowSelectMultipleOption = (props) => {
    
    return (
        <div className={styles.registraionInputContainer} onClick={() => props.toggle()} >
            <a className={styles.flowSelectionOptionText}>{props.optionName}</a>
            <Image alt='input icon' className={styles.leadingInputIcon} src={props.selected ? '/selectedIcon.svg' : '/unselectedIcon.svg'} width={30} height={30} />
        </div>
    )
    
}

export default FlowSelectMultipleOption
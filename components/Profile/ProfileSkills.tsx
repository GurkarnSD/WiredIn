"use client";
import styles from '../styles/Profile/ProfileSkills.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons'

export default function ProfileSkills() {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Skills</div>
                <div className={styles.modify}>
                    <FontAwesomeIcon className={styles.icon} icon={faPlus} />
                    <FontAwesomeIcon className={styles.icon} icon={faPen} />
                </div>
            </div>
        </div>
    )
}
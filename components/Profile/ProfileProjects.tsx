"use client";
import styles from '../styles/Profile/ProfileProjects.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons'

export default function ProfileProjects() {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Projects</div>
                <div className={styles.modify}>
                    <FontAwesomeIcon className={styles.icon} icon={faPlus} />
                    <FontAwesomeIcon className={styles.icon} icon={faPen} />
                </div>
            </div>
        </div>
    )
}
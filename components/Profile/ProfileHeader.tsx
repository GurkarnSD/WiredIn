import styles from '../styles/Profile/ProfileHeader.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

export default function ProfileHeader() {

    return (
        <div className={styles.container}>
            <div className={styles.banner}>

            </div>
            <div className={styles.profile}>
                <Image className={styles.profilePicture} src={""} alt={""} />

                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.header}>
                            <div className={styles.displayName}>GurkarnSD</div>
                            <button className={styles.follow}>Follow</button>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>100</div>
                                &nbsp;Following
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>50</div>
                                &nbsp;Followers
                            </div>
                        </div>
                    </div>

                    <div className={styles.dividerLine} />

                    <div className={styles.contentRight}>
                        <div className={styles.row}>
                            <div className={styles.title}>Founder & CEO Of WiredIn</div>
                            <FontAwesomeIcon className={styles.icon} icon={faGithub} />
                            <FontAwesomeIcon className={styles.iconEdit} icon={faEdit} />
                        </div>
                        <div className={styles.bio}>Some Random Bio Text</div>
                    </div>
                </div>
            </div>
        </div >
    )
}
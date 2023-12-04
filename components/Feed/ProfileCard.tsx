import styles from "../styles/Feed/ProfileCard.module.css"
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

export default async function ProfileCard(params: { user: any }) {

    const { user } = params;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.userInfo}>
                    <img className={styles.userImage} src={user.photoURL} />
                    <div className={styles.userName}>{user.displayName}</div>
                </div>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <Link href='/'>
                            <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
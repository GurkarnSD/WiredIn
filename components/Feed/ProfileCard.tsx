import styles from "../styles/Feed/ProfileCard.module.css"
import Link from 'next/link'
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

export default function ProfileCard(params: { user: any }) {

    const { user } = params;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.userInfo}>
                    <Image className={styles.userImage} src={user.profilePic} alt='User Image' width={65} height={65} />
                    <div className={styles.userName}>{user.displayName}</div>
                </div>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <Link href='/messages'>
                            <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
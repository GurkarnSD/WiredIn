import styles from "../styles/Feed/ProfileCard.module.css"
import Link from 'next/link'
import Image from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment } from '@fortawesome/free-solid-svg-icons'

const fetchProfileImage = async (profileKey: string) => {
    const res = await fetch(`${process.env.API_URL}/api/image/${profileKey}`);

    if (!res.ok) {
        throw new Error('Failed to Fetch Image Url')
    }

    const { url: profileURL } = await res.json();
    return profileURL;
}

export default async function ProfileCard(params: { user: any }) {

    const { user } = params;

    const profilePic = await fetchProfileImage(user.profilePic)

    return (
        <>
            <div className={styles.container}>
                <div className={styles.userInfo}>
                    <Image className={styles.userImage} src={profilePic} alt='User Image' width={65} height={65} />
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
import styles from '../styles/Profile/ProfileHeader.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const followUser = async (userId: string, pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "POST",
        body: JSON.stringify({
            user: userId,
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to follow user")
    }

    return res.json()
}

const unfollowUser = async (userId: string, pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "PUT",
        body: JSON.stringify({
            user: userId,
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unfollow user")
    }

    return res.json()
}

export default function ProfileHeader(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    return (
        <div className={styles.container}>
            <div className={styles.banner}>

            </div>
            <div className={styles.profile}>
                <Image className={styles.profilePicture} src={""} alt={""} />

                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.header}>
                            <div className={styles.displayName}>{pageUser?.displayName}</div>
                            {user?.uid !== pageUser?.uid ? (
                                !pageUser?.followers.includes(user?.uid) ?
                                    <button className={styles.follow} onClick={() => followUser(user.uid, pageUser.uid)}>Follow</button>
                                    : <button className={styles.follow} onClick={() => unfollowUser(user.uid, pageUser.uid)}>Unfollow</button>)
                                : null}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>{pageUser?.following.length}</div>
                                &nbsp;Following
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>{pageUser?.followers.length}</div>
                                &nbsp;Followers
                            </div>
                        </div>
                    </div>

                    <div className={styles.dividerLine} />

                    <div className={styles.contentRight}>
                        <div className={styles.row}>
                            <div className={styles.title}>{pageUser?.title}</div>
                            <FontAwesomeIcon className={styles.icon} icon={faGithub} />
                            {user?.uid === pageUser?.uid &&
                                <FontAwesomeIcon className={styles.iconEdit} icon={faEdit} />
                            }
                        </div>
                        <div className={styles.bio}>{pageUser?.bio}</div>
                    </div>
                </div>
            </div>
        </div >
    )
}
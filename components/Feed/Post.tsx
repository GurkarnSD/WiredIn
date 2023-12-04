import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "../styles/Feed/Post.module.css";

export default function Post(params: { data: any }) {

    const { data } = params;

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <div className={styles.postHeaderLeft}>
                    <Image className={styles.postProfile} src={`${process.env.S3ENDPOINT}${data.user.profilePic}`} alt={""} height={50} width={50} />
                    <div className={styles.postInfo}>
                        <div className={styles.displayName}>{data.user.displayName}</div>
                        <div className={styles.profileTitle}>{data.user.title}</div>
                    </div>
                </div>
                <div className={styles.postHeaderRight}>
                    <div className={styles.time}>{formatTimeDifference(data.createdAt)}</div>
                </div>
            </div>
            <div className={styles.postBody}>
                <div className={styles.text}>{data.text}</div>
            </div>
            <div className={styles.postFooter}>
                <div>
                    <FontAwesomeIcon className={styles.postIcon} icon={faHeart} />
                    <span className={styles.iconCount}>{data._count.likes}</span>
                </div>
                <div>
                    <FontAwesomeIcon className={styles.postIcon} icon={faComment} />
                    <span className={styles.iconCount}></span>
                </div>
            </div>
        </div>
    )
}

function formatTimeDifference(createdAt: string): string {
    const currentDateTime = new Date();
    const createdDateTime = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDateTime.getTime() - createdDateTime.getTime()) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

    if (timeDifferenceInMinutes < 60) {
        return `${timeDifferenceInMinutes} minute${timeDifferenceInMinutes !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);

    if (timeDifferenceInHours < 24) {
        return `${timeDifferenceInHours} hour${timeDifferenceInHours !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    return timeDifferenceInDays < 30
        ? `${timeDifferenceInDays} day${timeDifferenceInDays !== 1 ? 's' : ''} ago`
        : createdDateTime.toISOString().slice(0, 10);
}

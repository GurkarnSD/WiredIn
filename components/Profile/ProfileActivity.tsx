import styles from '../styles/Profile/ProfileActivity.module.css'
import { UserProfile } from '@/types';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProfileActivity(params: { pageUser: UserProfile }) {

    const { pageUser } = params;

    const { data: activityData } = useSWR(`/api/profile/activity?uid=${pageUser.uid}`, fetcher)

    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Activity</div>
            </div>
            <div className={styles.body}>
                {activityData?.map((activity: any) => (
                    <div className={styles.activity} key={activity.id} onClick={() => router.push(`/post/${activity.uid}`)}>
                        {activity.images[0] && (
                            <Image
                                className={styles.activityImage}
                                src={activity.images[0]}
                                alt='Activity Image'
                                width={100}
                                height={100}
                            />
                        )}
                        <div className={styles.activityContent}>
                            <div className={styles.activityHeader}>
                                {pageUser.displayName}&nbsp;Made A Post
                            </div>
                            <div className={styles.activityText}>{activity.text}</div>
                            <div className={styles.activityFooter}>
                                <div className={styles.activityStat}>
                                    <FontAwesomeIcon className={styles.activityIcon} icon={faHeart} />
                                    <div className={styles.activityLikes}>{activity._count.likes}</div>
                                </div>
                                <div className={styles.activityStat}>
                                    <FontAwesomeIcon className={styles.activityIcon} icon={faComment} />
                                    <div className={styles.activityComments}>{activity._count.comments}</div>
                                </div>
                                <div className={styles.activityDate} suppressHydrationWarning={true}>{formatTimeDifference(activity.createdAt)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

function formatTimeDifference(createdAt: Date): string {
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
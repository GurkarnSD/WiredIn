import styles from "../styles/Feed/Connect.module.css"
import Link from "next/link"
import Image from "next/image"
import { User, UserProfile } from "@/types"

const fetchRandomUsers = async (uid: string) => {
    const res = await fetch(`${process.env.API_URL}/api/users/?uid=${uid}`)

    if (!res.ok) {
        throw new Error("Failed to fetch users")
    }

    const data = await res.json();

    const updatedUsersData = await Promise.all(
        data.map(async (userData: UserProfile) => {
            if (userData.profilePic) {
                const profileURL = await fetchProfileImage(userData.profilePic);
                return { ...userData, profilePic: profileURL };
            }
            return userData;
        })
    );

    return updatedUsersData
}

const fetchProfileImage = async (profileKey: string) => {
    const res = await fetch(`${process.env.API_URL}/api/image/${profileKey}`);

    if (!res.ok) {
        throw new Error('Failed to Fetch Image Url')
    }

    const { url: profileURL } = await res.json();
    return profileURL;
}

export default async function Connect(params: { user: User }) {

    const { user } = params;

    const usersData = await fetchRandomUsers(user.uid);

    return (
        <div className={styles.container}>
            <div className={styles.title}>Connect</div>
            <div className={styles.usersContainer}>
                {usersData.map((user: UserProfile) => (
                    <Link className={styles.userContainer} href={`/profile/${user.displayName}`} key={user.uid}>
                        <Image className={styles.userImage} src={user.profilePic} alt='User Image' width={65} height={65} />
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user.displayName}</div>
                            <div className={styles.userTitle}>{user.title}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
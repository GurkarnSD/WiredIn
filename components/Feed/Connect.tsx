import styles from "../styles/Feed/Connect.module.css"
import Link from "next/link"
import Image from "next/image"

const fetchRandomUsers = async (uid: string) => {
    const res = await fetch(`${process.env.API_URL}/api/users/?uid=${uid}`)

    if (!res.ok) {
        throw new Error("Failed to fetch users")
    }

    return res.json()
}

export default async function Connect(params: { user: any }) {

    const { user } = params;

    const usersData = await fetchRandomUsers(user.uid);

    return (
        <>
            <div className={styles.outerContainer}>
                <div className={styles.innerContainer}>
                    <div className={styles.title}>Connect</div>
                    <div className={styles.usersContainer}>
                        {usersData.map((user: any) => (
                            <Link className={styles.userContainer} href={`/profile/${user.displayName}`} key={user}>
                                <Image className={styles.userImage} src={user.photoURL} alt='User Image' />
                                <div className={styles.userInfo}>
                                    <div className={styles.userName}>{user.displayName}</div>
                                    <div className={styles.userTitle}>{user.title}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
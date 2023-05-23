'use client';
import Navbar from "@/components/Navbar"
import Login from "@/components/Login"
import styles from '@/styles/Login.module.css'
import useCurrentUser from "@/lib/firebase/user"

export default function LoginPage() {

    const user = useCurrentUser()

    return (
        <>
            <Navbar user={user} />
            <div className={styles.container}>
                <Login user={user} />
            </div>
        </>
    )
}
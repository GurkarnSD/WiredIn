'use client';
import Navbar from "@/components/Navbar"
import ResetPassword from "@/components/ResetPassword"
import useCurrentUser from "@/lib/firebase/user"
import styles from '@/styles/ResetPassword.module.css'

export default function ResetPage() {

    const user = useCurrentUser()

    return (
        <>
            <Navbar user={user} />
            <div className={styles.container}>
                <ResetPassword />
            </div>
        </>
    )
}
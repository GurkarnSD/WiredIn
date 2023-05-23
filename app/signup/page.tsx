'use client';
import Navbar from "@/components/Navbar"
import Signup from "@/components/Signup"
import useCurrentUser from "@/lib/firebase/user"
import styles from '@/styles/Signup.module.css'

export default function SignupPage() {

    const user = useCurrentUser()

    return (
        <>
            <Navbar user={user} />
            <div className={styles.container}>
                <Signup />
            </div>
        </>
    )
}
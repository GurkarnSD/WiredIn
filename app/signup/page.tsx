import Navbar from "@/components/Navbar"
import Signup from "@/components/Signup"
import styles from '@/styles/Signup.module.css'

export default function SignupPage() {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Signup />
            </div>
        </>
    )
}
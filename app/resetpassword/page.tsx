import ResetPassword from "@/components/ResetPassword"
import styles from '@/styles/ResetPassword.module.css'
import Navbar from "@/components/Navbar"

export default function ResetPage() {

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <ResetPassword />
            </div>
        </>
    )
}
import Navbar from "@/components/Navbar"
import ResetPassword from "@/components/ResetPassword"
import styles from '@/styles/ResetPassword.module.css'

export default function ResetPage() {

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <ResetPassword />
            </div>
        </>
    )
}
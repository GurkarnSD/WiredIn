import Navbar from "@/components/Navbar"
import Login from "@/components/Login"
import styles from '@/styles/Login.module.css'

export default function LoginPage() {
    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <Login />
            </div>
        </>
    )
}
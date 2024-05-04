import ForgotPassword from "@/components/ForgotPassword"
import styles from '@/styles/ResetPassword.module.css'
import Navbar from "@/components/Navbar"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | WiredIn',
};


export default function ResetPage() {

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <ForgotPassword />
            </div>
        </>
    )
}
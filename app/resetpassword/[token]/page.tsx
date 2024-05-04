import ResetPassword from "@/components/ResetPassword"
import styles from '@/styles/ResetPassword.module.css'
import Navbar from "@/components/Navbar"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reset Password | WiredIn',
};


export default function ResetPage({ params }: { params: { token: string } }) {
    const token = params.token;

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <ResetPassword token={token} />
            </div>
        </>
    )
}
import Signup from "@/components/Signup"
import styles from '@/styles/Signup.module.css'
import Navbar from "@/components/Navbar"
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Signup | WiredIn',
};

export default function SignupPage() {

    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <Signup />
            </div>
        </>
    )
}
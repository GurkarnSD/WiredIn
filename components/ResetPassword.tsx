'use client';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/app'
import { useState } from 'react'
import styles from './styles/ResetPassword.module.css'
import Link from 'next/link'

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await sendPasswordResetEmail(email);

        setIsSuccess(true);
    }

    return (
        <>
            <div className={styles.resetpassword}>
                <div className={styles.wiredIn}>WiredIn</div>
                <div className={styles.reset}>Reset Password</div>
                {isSuccess ?
                    <div>Check your email</div>
                    :
                    <form className={styles.inputForm} onSubmit={handleSubmit}>
                        <input className={styles.input} required type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <button className={styles.loginButton} type='submit'>Reset Password</button>
                    </form>
                }
                <div className={styles.additional}>
                    <div>Don't Have An Account?&nbsp;<Link href='/signup' className={styles.signup}>Sign Up</Link></div>
                    <div>Already Have An Account?&nbsp;<Link href='/login' className={styles.login}>Login</Link></div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;
"use client";
import { useState } from 'react'
import styles from './styles/ForgotPassword.module.css'
import Link from 'next/link'

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('');

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return
        }

        await fetch(`${process.env.API_URL}/api/password/forgot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        })

        setIsSuccess(true);
    }

    return (
        <>
            <div className={styles.forgotpassword}>
                <div className={styles.wiredIn}>WiredIn</div>
                <div className={styles.reset}>Forgot Password</div>
                {isSuccess ?
                    <div className={styles.success}>Check your email</div>
                    :
                    <form className={styles.inputForm} onSubmit={handleSubmit}>
                        <input className={styles.input} required type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        {error && <div className={styles.error}>{error}</div>}
                        <button className={styles.resetButton} type='submit'>Send Email</button>
                    </form>
                }
                <div className={styles.additional}>
                    <div>Don&apos;t Have An Account?&nbsp;<Link href='/signup' className={styles.signup}>Sign Up</Link></div>
                    <div>Already Have An Account?&nbsp;<Link href='/login' className={styles.login}>Login</Link></div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;
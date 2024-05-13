"use client";
import styles from './styles/Login.module.css'
import Link from 'next/link'
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';
import defaultProfile from '@/assets/defaultProfilePic.png'
import { useRouter } from 'next/navigation'
import { User } from '@/types';

export default function Login({ user }: { user: User | null }) {

    const { push } = useRouter();

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');

        if (!loginForm.email || !loginForm.password) {
            setError('Please provide both email and password');
            return;
        }

        const locationInfo = await fetch('/api/location').then((res) => res.json());

        const response = await signIn('credentials', {
            redirect: false,
            email: loginForm.email.toLowerCase(),
            password: loginForm.password,
            userAgent: navigator.userAgent,
            ipAddress: locationInfo.ipAddress,
            location: locationInfo.location,
        })

        if (response && response.status == 401) {
            switch (response.error) {
                case 'User not found':
                    setError('User not found')
                    break;
                case 'Incorrect password':
                    setError('Incorrect password')
                    break;
                case 'User is not active':
                    setError('Please check your email to activate your account')
                    break;
            }
        } else {
            push('/feed');
        }
    }

    const googleSignin = async () => {
        const info = await signIn('google')
    }

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/session', { method: 'DELETE' })

            await signOut({ callbackUrl: `${process.env.API_URL}/login` })

        } catch (e) {
            console.error('Failed To Sign Out')
        }
    }

    if (user) {
        return (
            <div className={styles.loggedIn}>
                <div className={styles.wiredIn}>WiredIn</div>
                <form className={styles.loggedInInfo}>
                    <div className={styles.currentUser}>
                        <Image className={styles.profilePic} src={defaultProfile} alt="" />
                        <div className={styles.displayName}>{user.displayName}</div>
                    </div>
                    <div className={styles.logoutButton} onClick={handleSignOut}>Log Out</div>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.login}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm} onSubmit={handleSubmit}>
                <input className={styles.input} type="text" placeholder="Email" name="email" onChange={handleChange} autoComplete='email' />
                <input className={styles.input} type="password" placeholder="Password" name="password" onChange={handleChange} autoComplete='current-password' />
                {error && <div className={styles.error}>{error}</div>}
                <button className={styles.loginButton} type='submit'>Log In</button>
                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerText}>OR</div>
                    <div className={styles.dividerLine}></div>
                </div>
                <button className={styles.googleButton} type="button" onClick={googleSignin}>Log In With&nbsp;
                    <span className={styles.googleBlue}>G</span>
                    <span className={styles.googleRed}>o</span>
                    <span className={styles.googleYellow}>o</span>
                    <span className={styles.googleBlue}>g</span>
                    <span className={styles.googleGreen}>l</span>
                    <span className={styles.googleRed}>e</span>
                </button>
            </form>
            <div className={styles.additional}>
                <Link href='/forgotpassword'>Forgot Password?</Link>
                <div>Don&apos;t Have An Account?&nbsp;<Link href='/signup' className={styles.signup}>Sign Up</Link></div>
            </div>
        </div>
    )
}
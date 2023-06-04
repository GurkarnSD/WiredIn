"use client";
import styles from './styles/Login.module.css'
import Link from 'next/link'
import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';
import defaultProfile from '@/assets/defaultProfilePic.png'

export default function Login({ user }: { user: any | null }) {

    const [loginForm, setLoginForm] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await signIn('credentials', {
            email: loginForm.email,
            password: loginForm.password,
            callbackUrl: 'http://localhost:3000/'
        })

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
                    <button className={styles.logoutButton} onClick={() => signOut()}>Log Out</button>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.login}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm} onSubmit={handleSubmit}>
                <input className={styles.input} type="text" placeholder="Email" name="email" onChange={handleChange} />
                <input className={styles.input} type="password" placeholder="Password" name="password" onChange={handleChange} />
                <button className={styles.loginButton} type='submit'>Log In</button>
                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerText}>OR</div>
                    <div className={styles.dividerLine}></div>
                </div>
                <button className={styles.googleButton} onClick={() => signIn('google')}>Log In With&nbsp;
                    <span className={styles.googleBlue}>G</span>
                    <span className={styles.googleRed}>o</span>
                    <span className={styles.googleYellow}>o</span>
                    <span className={styles.googleBlue}>g</span>
                    <span className={styles.googleGreen}>l</span>
                    <span className={styles.googleRed}>e</span>
                </button>
            </form>
            <div className={styles.additional}>
                <Link href='/resetpassword'>Forgot Password?</Link>
                <div>Don't Have An Account?&nbsp;<Link href='/signup' className={styles.signup}>Sign Up</Link></div>
            </div>
        </div>
    )
}
'use client';
import styles from './styles/Login.module.css'
import Link from 'next/link'
import { useState } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/app'

const Login: React.FC = () => {

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

    const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle] = useSignInWithGoogle(auth);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log(loginForm)

        signInWithEmailAndPassword(loginForm.email.toLowerCase(), loginForm.password)
            .then((userCredential) => {
                const user = userCredential?.user;

                if (user) {
                    console.log('Login success:', user);
                    // Redirect to a success page or perform other actions
                } else {
                    console.log('Login error:', userCredential);
                    // Handle login error, show error message, etc.
                }
            })
            .catch((error) => {
                console.log('Login error:', error);
                // Handle login error, show error message, etc.
            });
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
                <button className={styles.googleButton} onClick={() => signInWithGoogle()}>Log In With&nbsp;
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

export default Login;
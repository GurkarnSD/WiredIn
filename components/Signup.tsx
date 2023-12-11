"use client";
import styles from './styles/Signup.module.css'
import Link from 'next/link'
import { useState } from 'react'

const Signup: React.FC = () => {

    const [signupForm, setSignupForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSignupForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Reset the error before trying to submit the form
        if (error) setError('')

        // Check passwords match
        if (signupForm.password !== signupForm.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(signupForm.email)) {
            setError('Invalid email format');
            return
        }

        // Check password format
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,256}$/gm

        if (!passwordRegex.test(signupForm.password)) {
            setError(
                'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
            )
            return
        }

        await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: signupForm.username,
                email: signupForm.email,
                password: signupForm.password,
            }),
        })

        setSignupForm({ username: '', email: '', password: '', confirmPassword: '' })
        setSuccess('Check Your Email To Activate Your Account')
    }

    return (
        <div className={styles.signup}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm} onSubmit={handleSubmit}>
                <input required className={styles.input} name='username' type="text" placeholder="Username" value={signupForm.username} onChange={handleChange} />
                <input required className={styles.input} name='email' type="text" placeholder="Email" value={signupForm.email} onChange={handleChange} />
                <input required className={styles.input} name='password' type="password" placeholder="Password" value={signupForm.password} onChange={handleChange} />
                <input required className={styles.input} name='confirmPassword' type="password" placeholder="Confirm Password" value={signupForm.confirmPassword} onChange={handleChange} />
                {error && <div className={styles.error}>{error}</div>}
                {success && <div className={styles.success}>{success}</div>}
                <button className={styles.signupButton} type='submit'>Signup</button>
                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerText}>OR</div>
                    <div className={styles.dividerLine}></div>
                </div>
                <Link href='/login' className={styles.googleButton}>Login With&nbsp;
                    <span className={styles.googleBlue}>G</span>
                    <span className={styles.googleRed}>o</span>
                    <span className={styles.googleYellow}>o</span>
                    <span className={styles.googleBlue}>g</span>
                    <span className={styles.googleGreen}>l</span>
                    <span className={styles.googleRed}>e</span>
                </Link>
            </form>
            <div className={styles.additional}>
                <div>Already Have An Account?&nbsp;<Link href='/login' className={styles.login}>Login</Link></div>
            </div>
        </div>
    )
}

export default Signup;
"use client";
import { useState } from 'react'
import styles from './styles/ForgotPassword.module.css'
import Link from 'next/link'

function ResetPassword(params: { token: string }) {

    const { token } = params;
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const [resetForm, setResetForm] = useState({
        password: '',
        confirmPassword: '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setResetForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError('');

        // Check passwords match
        if (resetForm.password !== resetForm.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        // Check password format
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,256}$/gm

        if (!passwordRegex.test(resetForm.password)) {
            setError(
                'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
            )
            return
        }

        const reset = await fetch(`${process.env.API_URL}/api/password/${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: resetForm.password,
            }),
        })

        const data = await reset.json();

        if (data.response == 'ok') {
            setIsSuccess(true);
        } else if (data.response == 'bad') {
            setError('Invalid Token')
        } else {
            setError('Password Reset Failed')
        }
    }

    return (
        <>
            <div className={styles.resetpassword}>
                <div className={styles.wiredIn}>WiredIn</div>
                <div className={styles.reset}>Reset Password</div>
                {isSuccess ?
                    <>
                        <div className={styles.success}>Password Successfully Reset</div>
                        <Link href='/login' className={styles.go}>Proceed To Login</Link>
                    </>
                    :
                    <form className={styles.inputForm} onSubmit={handleSubmit}>
                        <input required className={styles.input} name='password' type="password" placeholder="Password" onChange={handleChange} />
                        <input required className={styles.input} name='confirmPassword' type="password" placeholder="Confirm Password" onChange={handleChange} />
                        {error && <div className={styles.error}>{error}</div>}
                        <button className={styles.resetButton} type='submit'>Set New Password</button>
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

export default ResetPassword;
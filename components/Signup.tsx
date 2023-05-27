"use client";
import styles from './styles/Signup.module.css'
import Link from 'next/link'
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/app'
import { useState } from 'react'
import { UserCredential, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Signup: React.FC = () => {
    const router = useRouter();

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
    const [createUserWithEmailAndPassword, user] = useCreateUserWithEmailAndPassword(auth);

    const createUserAndSetDisplayName = async (email: string, password: string, displayName: string) => {
        const currentUser: UserCredential | undefined = await createUserWithEmailAndPassword(email, password)
        console.log(currentUser)

        if (currentUser !== undefined) {
            await updateProfile(currentUser.user, { displayName: displayName })
            console.log(currentUser.user.displayName)
        }
    }

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

        await createUserAndSetDisplayName(signupForm.email, signupForm.password, signupForm.username)
        router.push('/login')
    }

    return (
        <div className={styles.signup}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm} onSubmit={handleSubmit}>
                <input required className={styles.input} name='username' type="text" placeholder="Username" onChange={handleChange} />
                <input required className={styles.input} name='email' type="text" placeholder="Email" onChange={handleChange} />
                <input required className={styles.input} name='password' type="password" placeholder="Password" onChange={handleChange} />
                <input required className={styles.input} name='confirmPassword' type="password" placeholder="Confirm Password" onChange={handleChange} />
                {(error) && (
                    <div className={styles.error}>{error}</div>
                )}
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
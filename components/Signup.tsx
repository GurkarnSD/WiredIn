import styles from './styles/Signup.module.css'
import Link from 'next/link'

export default function Signup() {
    return (
        <div className={styles.signup}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm}>
            <input className={styles.input} type="text" placeholder="Username" />
                <input className={styles.input} type="text" placeholder="Email" />
                <input className={styles.input} type="password" placeholder="Password" />
                <input className={styles.input} type="password" placeholder="Confirm Password" />
                <button className={styles.signupButton}>Signup</button>
                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerText}>OR</div>
                    <div className={styles.dividerLine}></div>
                </div>
                <button className={styles.googleButton}>Sign Up With&nbsp;
                    <span className={styles.googleBlue}>G</span>
                    <span className={styles.googleRed}>o</span>
                    <span className={styles.googleYellow}>o</span>
                    <span className={styles.googleBlue}>g</span>
                    <span className={styles.googleGreen}>l</span>
                    <span className={styles.googleRed}>e</span>
                </button>
            </form>
            <div className={styles.additional}>
                <div>Already Have An Account?&nbsp;<Link href='/login' className={styles.login}>Login</Link></div>
            </div>
        </div>
    )
}
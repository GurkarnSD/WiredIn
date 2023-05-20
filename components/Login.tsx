import styles from './styles/Login.module.css'
import Link from 'next/link'

export default function Login() {
    return (
        <div className={styles.login}>
            <div className={styles.wiredIn}>WiredIn</div>
            <form className={styles.inputForm}>
                <input className={styles.input} type="text" placeholder="Email" />
                <input className={styles.input} type="password" placeholder="Password" />
                <button className={styles.loginButton}>Log In</button>
                <div className={styles.divider}>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.dividerText}>OR</div>
                    <div className={styles.dividerLine}></div>
                </div>
                <button className={styles.googleButton}>Log In With&nbsp;
                    <span className={styles.googleBlue}>G</span>
                    <span className={styles.googleRed}>o</span>
                    <span className={styles.googleYellow}>o</span>
                    <span className={styles.googleBlue}>g</span>
                    <span className={styles.googleGreen}>l</span>
                    <span className={styles.googleRed}>e</span>
                </button>
            </form>
            <div className={styles.additional}>
                <div>Forgot Password?</div>
                <div>Don't Have An Account?&nbsp;<Link href='/signup' className={styles.signup}>Sign Up</Link></div>
            </div>
        </div>
    )
}
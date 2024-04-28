import Navbar from '../components/Navbar'
import styles from '../styles/NotFound.module.css'

export default function NotFound() {
    return (
        <>
            {/* @ts-expect-error Async Server Component */}
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.errorCode}>404</h1>
                <p className={styles.errorMessage}>Sorry, the page you are looking for does not exist.</p>
            </div>
        </>
    )

}

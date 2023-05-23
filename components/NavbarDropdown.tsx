import styles from './styles/NavbarDropdown.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComment, faGear } from '@fortawesome/free-solid-svg-icons'
import { User } from 'firebase/auth'
import { auth } from '@/lib/firebase/app'
import { useRouter } from 'next/navigation'

export default function NavbarDropdown(props: { user: User | null }) {
    const user: User | null = props.user

    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.NavbarDropdown}>
                <div className={styles.displayName}>{user?.displayName}</div>
                <div className={styles.options}>
                    <div className={styles.option}>
                        <Link href='/' >
                            <FontAwesomeIcon icon={faUser} className={styles.icon} />Profile
                        </Link>
                    </div>
                    <div className={styles.option}>
                        <Link href='/'>
                            <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                        </Link>
                    </div>
                    <div className={styles.option}>
                        <Link href='/' >
                            <FontAwesomeIcon icon={faGear} className={styles.icon} />Settings
                        </Link>
                    </div>
                </div>
                <div className={styles.logout} onClick={() => { router.push('/login'); auth.signOut() }}>Log Out</div>
            </div>
        </div>
    )
}
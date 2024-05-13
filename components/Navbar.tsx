import styles from './styles/Navbar.module.css'
import Link from 'next/link'
import NavbarDropdown from '@/components/NavbarDropdown'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { UserSession } from '@/types'

export default async function Navbar() {

    const session = (await getServerSession(authOptions)) as UserSession;

    return (
        <>
            <div className={styles.navbar}>
                <div>
                    <Link className={styles.wiredIn} href={session ? '/feed' : '/'}>
                        WiredIn
                    </Link>
                </div>
                <div className={styles.navigation}>
                    {session &&
                        <div className={styles.links}>
                            <Link className={styles.link} href="/feed">
                                Feed
                            </Link>
                            <Link className={styles.link} href="/contracts">
                                Contracts
                            </Link>
                            <Link className={styles.link} href="/jobs">
                                Jobs
                            </Link>
                        </div>
                    }
                    <NavbarDropdown session={session} />
                </div>
            </div>
        </>
    )
}
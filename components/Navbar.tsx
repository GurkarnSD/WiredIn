import styles from './styles/Navbar.module.css'
import Link from 'next/link'
import NavbarDropdown from '@/components/NavbarDropdown'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export default async function Navbar() {

    const session = await getServerSession(authOptions);

    return (
        <>
            <div className={styles.navbar}>
                <div>
                    <Link className={styles.wiredIn} href="/">
                        WiredIn
                    </Link>
                </div>
                <div className={styles.links}>
                    <Link className={styles.link} href="/feed">
                        Feed
                    </Link>
                    <Link className={styles.link} href="/forums">
                        Forums
                    </Link>
                    <Link className={styles.link} href="/contracts">
                        Contracts
                    </Link>
                    <Link className={styles.link} href="/jobs">
                        Jobs
                    </Link>
                    <NavbarDropdown user={session?.user} />
                </div>
            </div>
        </>
    )
}
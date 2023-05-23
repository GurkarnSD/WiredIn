import styles from './styles/Navbar.module.css'
import Link from 'next/link'
import { User } from 'firebase/auth'
import { useState, useEffect, useRef } from 'react'
import NavbarDropdown from '@/components/NavbarDropdown'
import Image from 'next/image'
import defaultProfile from '@/assets/defaultProfilePic.png'

export default function Navbar(props: { user: User | null }) {
    const user: User | null = props.user

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const dropdownRef = useRef(null);
    handleCloseDropdown(dropdownRef, setDropdownVisible);

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
                    {user ? (
                        <div className={styles.profileContainer} onClick={toggleDropdown}>
                            <Image className={styles.profilePic} src={defaultProfile} alt="" />
                        </div>
                    ) : (
                        <Link className={styles.link} href="/login">
                            Login
                        </Link>
                    )}
                </div>
            </div>
            <div className={styles.dropdownContainer}>
                {dropdownVisible && <div ref={dropdownRef}><NavbarDropdown user={user} /></div>}
            </div>
        </>
    )
}

function handleCloseDropdown(ref: React.RefObject<HTMLElement>, setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }

            if (ref.current && ref.current.contains(event.target as Node)) {
                setTimeout(() => {
                    setDropdownVisible(false);
                }, 100);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
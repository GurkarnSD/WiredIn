"use client";
import styles from './styles/NavbarDropdown.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComment, faGear } from '@fortawesome/free-solid-svg-icons'
import { auth } from '@/lib/firebase/app'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import defaultProfile from '@/assets/defaultProfilePic.png'
import useCurrentUser from "@/lib/firebase/user"

export default function NavbarDropdown() {
    const user = useCurrentUser();

    const router = useRouter();

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const dropdownRef = useRef(null);
    handleCloseDropdown(dropdownRef, setDropdownVisible);

    return (
        <>
            {user ? (
                <div className={styles.profileContainer} onClick={toggleDropdown}>
                    <Image className={styles.profilePic} src={defaultProfile} alt="" />
                </div>
            ) : (
                <Link className={styles.link} href="/login">
                    Login
                </Link>
            )}
            <div className={styles.dropdownContainer} ref={dropdownRef}>
                {dropdownVisible && (
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
                )}
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
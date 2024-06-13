"use client";
import styles from './styles/NavbarDropdown.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComment, faGear, faFileContract, faSuitcase, faShare, faAddressBook, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react';
import { User, UserSession } from '@/types';

export default function NavbarDropdown({ session, lightMode, nav = false }: { session: UserSession | null, lightMode?: boolean, nav?: boolean }) {

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    HandleCloseDropdown(dropdownRef, profileRef, setDropdownVisible);

    const handleSignOut = async () => {
        try {
            await fetch('/api/session', { method: 'DELETE' })

            await signOut({ callbackUrl: `${process.env.API_URL}/login` })

        } catch (e) {
            console.error('Failed To Sign Out')
        }
    }

    return (
        <>
            {session?.user ? (
                <div className={styles.profileContainer} onClick={toggleDropdown} ref={profileRef}>
                    <Image className={styles.profilePic} src={session.user.profilePic} alt="" width={60} height={60} />
                </div>
            ) : (
                <Link className={styles.link} href="/login">
                    Login
                </Link>
            )}
            {dropdownVisible && session?.user && (
                <div className={styles.dropdownContainer} ref={dropdownRef}>
                    <div className={styles.container}>
                        <div className={`${styles.NavbarDropdown}  ${lightMode ? styles.lightMode : ''}`}>
                            <div className={styles.displayName}>{session?.user?.displayName}</div>
                            <div className={styles.options}>
                                <div className={`${styles.option}  ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href={`/profile/${session?.user.displayName}`} >
                                        <FontAwesomeIcon icon={faUser} className={styles.icon} />Profile
                                    </Link>
                                </div>
                                <div className={`${styles.option} ${nav ? styles.links : styles.hidden} ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href={'/feed'} >
                                        <FontAwesomeIcon icon={faShare} className={styles.icon} />Feed
                                    </Link>
                                </div>
                                <div className={`${styles.option} ${nav ? styles.links : styles.hidden} ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href={'/contracts'} >
                                        <FontAwesomeIcon icon={faFileContract} className={styles.icon} />Contracts
                                    </Link>
                                </div>
                                <div className={`${styles.option} ${nav ? styles.links : styles.hidden} ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href={'/jobs'} >
                                        <FontAwesomeIcon icon={faSuitcase} className={styles.icon} />Jobs
                                    </Link>
                                </div>
                                <div className={`${styles.option} ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href='/messages'>
                                        <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                                    </Link>
                                </div>
                                <div className={`${styles.option}  ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href='/contactus' >
                                        <FontAwesomeIcon icon={faAddressBook} className={styles.icon} />Contact Us
                                    </Link>
                                </div>
                                <div className={`${styles.option}  ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href='https://buymeacoffee.com/wiredin' >
                                        <FontAwesomeIcon icon={faMoneyBillWave} className={styles.icon} />Donate
                                    </Link>
                                </div>
                                <div className={`${styles.option}  ${lightMode ? styles.lightMode : ''}`}>
                                    <Link href='/settings' >
                                        <FontAwesomeIcon icon={faGear} className={styles.icon} />Settings
                                    </Link>
                                </div>
                            </div>
                            <text className={styles.logout} onClick={handleSignOut}>Log Out</text>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

function HandleCloseDropdown(dropdownRef: React.RefObject<HTMLElement>, profileRef: React.RefObject<HTMLElement>, setDropdownVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef, profileRef]);
}
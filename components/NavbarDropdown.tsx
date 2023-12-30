"use client";
import styles from './styles/NavbarDropdown.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faComment, faGear } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { signOut } from 'next-auth/react';

const fetchProfileImage = async (profileKey: string) => {
    const response = await fetch(`/api/image/${profileKey}`);
    const { url: profileURL } = await response.json();
    return profileURL;
}

export default function NavbarDropdown({ user }: { user: any | null }) {

    const [profilePic, setProfilePic] = useState('')

    useEffect(() => {
        const fetchImage = async () => {
            const image = await fetchProfileImage(user.profilePic);
            setProfilePic(image);
        };
        if (user) fetchImage();
    }, [user?.profilePic]);

    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const dropdownRef = useRef(null);
    const profileRef = useRef(null);
    HandleCloseDropdown(dropdownRef, profileRef, setDropdownVisible);

    return (
        <>
            {user ? (
                <div className={styles.profileContainer} onClick={toggleDropdown} ref={profileRef}>
                    <Image className={styles.profilePic} src={profilePic} alt="" width={60} height={60} />
                </div>
            ) : (
                <Link className={styles.link} href="/login">
                    Login
                </Link>
            )}
            {dropdownVisible && (
                <div className={styles.dropdownContainer} ref={dropdownRef}>
                    <div className={styles.container}>
                        <div className={styles.NavbarDropdown}>
                            <div className={styles.displayName}>{user?.displayName}</div>
                            <div className={styles.options}>
                                <div className={styles.option}>
                                    <Link href={`/profile/${user.displayName}`} >
                                        <FontAwesomeIcon icon={faUser} className={styles.icon} />Profile
                                    </Link>
                                </div>
                                <div className={styles.option}>
                                    <Link href='/messages'>
                                        <FontAwesomeIcon icon={faComment} className={styles.icon} />Messages
                                    </Link>
                                </div>
                                <div className={styles.option}>
                                    <Link href='/' >
                                        <FontAwesomeIcon icon={faGear} className={styles.icon} />Settings
                                    </Link>
                                </div>
                            </div>
                            <text className={styles.logout} onClick={() => { signOut({ callbackUrl: `${process.env.API_URL}/login` }) }}>Log Out</text>
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
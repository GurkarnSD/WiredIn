'use client';
import { useState, useEffect } from "react";
import styles from "../styles/Feed/UserSearch.module.css"
import Link from "next/link"
import Image from "next/image"
import { UserProfile } from "@/types";

async function searchUsers(query: string) {
    const res = await fetch(`/api/users/search?query=${query}`);
    const data = await res.json();
    const updatedUsersData = await Promise.all(
        data.map(async (userData: UserProfile) => {
            if (userData.profilePic) {
                const profileURL = await fetchProfileImage(userData.profilePic);
                return { ...userData, profilePic: profileURL };
            }
            return userData;
        })
    );

    return updatedUsersData
}

const fetchProfileImage = async (profileKey: string) => {
    const res = await fetch(`${process.env.API_URL}/api/image/${profileKey}`);

    if (!res.ok) {
        throw new Error('Failed to Fetch Image Url')
    }

    const { url: profileURL } = await res.json();
    return profileURL;
}

export default function UserSearchBar() {

    const [searchQuery, setSearchQuery] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        setDebounceTimeout(
            setTimeout(() => {
                searchUsers(searchQuery).then((data) => {
                    setSearchResults(data);
                });
            }, 500)
        );
    }, [searchQuery]);

    return (
        <div className={styles.container}>
            <input className={styles.searchBar} name='search' placeholder="Search Users" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchResults.length > 0 && <div className={styles.resultsContainer}>
                {searchResults.map((user: UserProfile) => (
                    <Link className={styles.userContainer} href={`/profile/${user.displayName}`} key={user.uid}>
                        <Image className={styles.userImage} src={user.profilePic} alt='User Image' width={65} height={65} />
                        <div className={styles.userInfo}>
                            <div className={styles.userName}>{user.displayName}</div>
                            <div className={styles.userTitle}>{user.title}</div>
                        </div>
                    </Link>
                ))}
            </div>
            }
        </div>
    );
}
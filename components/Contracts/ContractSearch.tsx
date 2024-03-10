'use client';
import styles from '../styles/Contracts/Contracts.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { User, UserContract } from '@/types'
import Contract from './Contract'

const fetchContracts = async (uid: string, page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/contracts/?uid=${uid}&page=${page}&pageSize=${pageSize}`)

    if (!res.ok) {
        throw new Error("Failed to fetch contracts")
    }

    return res.json()
}

export default function ContractSearch(params: { user: User }) {

    const [contracts, setContracts] = useState<UserContract[]>([]);
    const [page, setPage] = useState(1);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const { user } = params;

    const loadMoreContracts = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreContracts = async () => {
            const newContracts = await fetchContracts(user.uid, page);
            if (newContracts.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setContracts((prevContracts: UserContract[]) => [...prevContracts, ...newContracts]);
        };
        fetchMoreContracts();
    }, [page]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" placeholder="Contract Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} />
                    </div>
                    <button className={styles.searchButton}>Search Contracts</button>
                </div>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Contracts Avaliable</h1>
                    <Link href={'/mycontracts'} className={styles.contractsButton}>View My Contracts</Link>
                </div>
            </div>
            <div className={styles.searchResults}>
                {contracts.map((contract: UserContract) =>
                    <Contract key={contract.id} contract={contract} user={user} />
                )}
            </div>
            {showLoadMore && <button className={styles.loadMore} onClick={() => loadMoreContracts()}>Load More</button>}
        </div>
    )
}
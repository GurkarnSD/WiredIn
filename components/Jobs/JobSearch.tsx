'use client';
import styles from '../styles/Jobs/Jobs.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { User, UserJob } from '@/types'
import Job from './Job'

const fetchJobs = async (uid: string, page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/jobs/?uid=${uid}&page=${page}&pageSize=${pageSize}`)

    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }

    return res.json()
}

const searchJobs = async (uid: string, title: string, page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/jobs/search/?uid=${uid}&page=${page}&pageSize=${pageSize}&title=${title}`)

    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }

    return res.json()
}

export default function JobSearch(params: { user: User }) {

    const [jobs, setJobs] = useState<UserJob[]>([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const { user } = params;

    const loadMoreJobs = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreJobs = async () => {
            if (!searchMode) {
                const newJobs = await fetchJobs(user.uid, page);
                if (newJobs.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
            } else {
                const newJobs = await searchJobs(user.uid, searchInput, page);
                if (newJobs.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
            }
        };
        fetchMoreJobs();
    }, [page]);

    const handleSearch = async () => {
        if (searchInput === '') {
            const newJobs = await fetchJobs(user.uid, page);
            setJobs(newJobs);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setSearchMode(false);
        } else {
            const newJobs = await searchJobs(user.uid, searchInput, page);
            setJobs(newJobs);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setSearchMode(true);
        }
        setPage(1);
        return;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Job Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} />
                    </div>
                    <button className={styles.searchButton} onClick={handleSearch}>Search Jobs</button>
                </div>
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Jobs Avaliable</h1>
                    <Link href={'/myjobs'} className={styles.jobsButton}>View My Jobs</Link>
                </div>
            </div>
            <div className={styles.searchResults}>
                {jobs.map((job: UserJob) =>
                    <Job key={job.id} job={job} user={user} />
                )}
            </div>
            {showLoadMore && <button className={styles.loadMore} onClick={() => loadMoreJobs()}>Load More</button>}
        </div>
    )
}
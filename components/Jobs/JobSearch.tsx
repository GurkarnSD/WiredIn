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

export default function JobSearch(params: { user: User }) {

    const [jobs, setJobs] = useState<UserJob[]>([]);
    const [page, setPage] = useState(1);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const { user } = params;

    const loadMoreJobs = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreJobs = async () => {
            const newJobs = await fetchJobs(user.uid, page);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
        };
        fetchMoreJobs();
    }, [page]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" placeholder="Job Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} />
                    </div>
                    <button className={styles.searchButton}>Search Jobs</button>
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
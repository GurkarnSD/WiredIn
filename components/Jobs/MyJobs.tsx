'use client';
import styles from '../styles/Jobs/Jobs.module.css'
import { useState } from 'react';
import Modal from '../Modal';
import JobCreator from './JobCreator'
import Job from './Job';
import useSWR from 'swr';
import { UserJob, User } from '@/types';
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MyJobs(params: { user: User }) {

    const { user } = params

    const { data: skillOptions } = useSWR('/api/profile/skills', fetcher)
    const { data: tagOptions } = useSWR('/api/tags', fetcher)
    const { data: userJobs } = useSWR(`/api/jobs/user/?uid=${user.uid}`, fetcher)
    const [showJobCreator, setShowJobCreator] = useState(false)

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.title}>My Jobs</h1>
                        <button className={styles.jobsButton} onClick={() => setShowJobCreator(true)}>Create a Job</button>
                    </div>
                </div>
                <div>
                    {userJobs && userJobs.map((job: UserJob) => {
                        return (
                            <Job key={job.id} job={job} user={user} />
                        )
                    })}
                </div>
            </div>
            {showJobCreator &&
                <Modal isOpen={showJobCreator} onClose={() => setShowJobCreator(false)}>
                    <JobCreator user={user} skillOptions={skillOptions} tagOptions={tagOptions} setModal={setShowJobCreator} />
                </Modal>
            }
        </>
    )
}
'use client';
import styles from '../styles/Jobs/Jobs.module.css'
import { useState } from 'react';
import Modal from '../Modal';
import JobCreator from './JobCreator'
import Job from './Job';
import useSWR, { mutate } from 'swr';
import { UserJob, User } from '@/types';
import { toast } from 'sonner'
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MyJobs(params: { user: User }) {

    const { user } = params

    const { data: skillOptions } = useSWR('/api/profile/skills', fetcher)
    const { data: tagOptions } = useSWR('/api/tags', fetcher)
    const { data: userJobs } = useSWR('/api/jobs/user', fetcher)
    const [showJobCreator, setShowJobCreator] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<UserJob | undefined>();

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
                            <Job key={job.id} job={job} user={user} selectJob={setSelectedJob} openEditModal={setIsEditModalOpen} />
                        )
                    })}
                </div>
            </div>
            {showJobCreator &&
                <Modal isOpen={showJobCreator} onClose={() => setShowJobCreator(false)}>
                    <JobCreator skillOptions={skillOptions} tagOptions={tagOptions} setModal={setShowJobCreator} toastTrigger={() => toast.success("Job Created")} onSuccess={() => mutate('/api/jobs/user')} />
                </Modal>
            }

            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <JobCreator skillOptions={skillOptions} tagOptions={tagOptions} setModal={setIsEditModalOpen} toastTrigger={() => toast.success("Job Updated")} editMode job={selectedJob} />
                </Modal>
            )}
        </>
    )
}
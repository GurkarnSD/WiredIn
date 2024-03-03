'use client';
import styles from "../styles/Jobs/Job.module.css";
import { SkillOption, User, UserJob, UserProfile } from "@/types";
import Image from "next/image";
import Modal from "../Modal";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Job(params: { job: UserJob, user: User }) {

    const { job, user } = params

    async function applyToJob() {
        const res = await fetch('/api/jobs/apply', {
            body: JSON.stringify({
                jobId: job.uid,
                userId: user.uid
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
    }

    async function deleteJob() {
        const res = await fetch('/api/jobs', {
            body: JSON.stringify({
                jobId: job.uid,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })
    }

    const [showApplicants, setShowApplicants] = useState(false);

    return (
        <div className={styles.jobContainer}>
            <div className={styles.job}>
                {user.uid === job.user.uid &&
                    <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} onClick={deleteJob} />
                }
                <div className={styles.userInfo}>
                    <Image className={styles.userImage} src={job.user.profilePic} alt='User Image' width={100} height={100} />
                    <h2 className={styles.userName}>{job.user.displayName}</h2>
                </div>
                <div className={styles.jobInfo}>
                    <div className={styles.jobInfoHeader}>
                        <div>
                            <h2 className={styles.jobTitle}>{job.title}</h2>
                            <h4 className={styles.jobLocation}>{job.location}</h4>
                        </div>
                        {user.uid === job.user.uid ?
                            <button className={styles.button} onClick={() => setShowApplicants(true)}>View Applicants</button>
                            :
                            job.applicants?.find(applicant => applicant.uid === user.uid) ? <button className={styles.button} disabled>Applied</button> : <button className={styles.button} onClick={applyToJob}>Apply</button>}
                    </div>
                    {job.skills.length > 0 &&
                        <div className={styles.jobSkills}>
                            <h4>Skills:</h4>&nbsp;{job.skills.map(skill => skill.skill).join(', ')}
                        </div>
                    }
                    {job.salary ?
                        <div className={styles.jobDetails}>
                            <h4>Salary:</h4>&nbsp;${job.salary}
                        </div>
                        : job.hourly &&
                        <div className={styles.jobDetails}>
                            <h4>Hourly Rate:</h4>&nbsp;${job.hourly}
                        </div>
                    }
                    {job.start &&
                        <div className={styles.jobDetails}>
                            <h4>Start:</h4>&nbsp;{new Date(job.start).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            {job.end &&
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(job.end).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </div>
                            }
                        </div>
                    }
                    <div className={styles.jobDescription}>{job.description}</div>
                    <div className={styles.jobInfoFooter}>
                        <div className={styles.jobTags}>
                            {job.tags.map(tag => {
                                return (
                                    <div key={tag.tag} className={styles.tag}>{tag.tag}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            {showApplicants &&
                <Modal isOpen={showApplicants} onClose={() => setShowApplicants(false)} backIcon={true}>
                    <Applicants jobSkills={job.skills} applicants={job.applicants} />
                </Modal>
            }
        </div>
    )
}

function Applicants(params: { jobSkills: SkillOption[], applicants: UserProfile[] | undefined }) {

    const { jobSkills, applicants } = params;

    const requestedSkills = jobSkills.map(skill => skill.skill);

    return (
        <div className={styles.applicantsContainer}>
            <div className={styles.applicantsHeader}>
                <h1 className={styles.title}>Current Applicants</h1>
            </div>
            <div className={styles.applicantsBody}>
                {applicants?.map(applicant => {
                    const applicantSkills = applicant.skills?.map(skill => skill.name) || [];
                    const matchingSkills = applicantSkills.filter(skill => requestedSkills.includes(skill));
                    const matchPercentage = (matchingSkills.length / requestedSkills.length) * 100;

                    return (
                        <div key={applicant.uid} className={styles.applicant}>
                            <Image className={styles.userImage} src={applicant.profilePic} alt='User Image' width={50} height={50} />
                            <div className={styles.applicantInfo}>
                                <h2 className={styles.userName}>{applicant.displayName}</h2>
                                {matchPercentage <= 25 && <h2 className={styles.poor}>Poor Skills Match</h2>}
                                {matchPercentage > 25 && matchPercentage <= 60 && <h2 className={styles.partial}>Partial Skills Match</h2>}
                                {matchPercentage > 60 && matchPercentage <= 80 && <h2 className={styles.adequate}>Adequate Skills Match</h2>}
                                {matchPercentage > 80 && <h2 className={styles.excellent}>Excellent Skills Match</h2>}
                            </div>
                            <Link className={styles.view} href={`/profile/${applicant.displayName}`}>View</Link>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
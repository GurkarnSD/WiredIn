'use client';
import styles from "../styles/Contracts/Contract.module.css";
import { SkillOption, User, UserContract, UserProfile } from "@/types";
import Image from "next/image";
import Modal from "../Modal";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";
import ConfirmationPopup from "../ConfirmationPopup";
import { toast } from 'sonner'
import { Fragment } from "react";

export default function Contract(params: { contract: UserContract, user: User, selectContract?: (contract: UserContract) => void, openEditModal?: (isOpen: boolean) => void, onDelete?: () => void }) {

    const { contract, user, selectContract, openEditModal, onDelete } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    async function applyToContract() {
        const res = await fetch('/api/contracts/apply', {
            body: JSON.stringify({
                contractId: contract.uid,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })

        if (!res.ok) {
            throw new Error("Failed to Apply to Contract")
        }

        toast.success('Successfully Applied to Contract')

        return res.json()
    }

    async function deleteContract() {
        const res = await fetch('/api/contracts', {
            body: JSON.stringify({
                contractId: contract.uid,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })

        if (!res.ok) {
            throw new Error("Failed to Delete Contract")
        }

        toast.success('Contract Deleted')
        onDelete && onDelete();

        return res.json()
    }

    const [showApplicants, setShowApplicants] = useState(false);

    return (
        <div className={styles.contractContainer}>
            <div className={styles.contract}>
                <div className={styles.userInfo}>
                    <Image className={styles.userImage} src={contract.user.profilePic} alt='User Image' width={100} height={100} />
                    <h2 className={styles.userName}>{contract.user.displayName}</h2>
                    {user.uid === contract.user.uid &&
                        <div className={styles.settings}>
                            <FontAwesomeIcon icon={faPencil} className={styles.editIcon} onClick={() => { if (selectContract) selectContract(contract); if (openEditModal) openEditModal(true); }} />
                            <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} onClick={() => setConfirmationPopup(true)} />
                        </div>
                    }
                </div>
                <div className={styles.contractInfo}>
                    <div className={styles.contractInfoHeader}>
                        <div>
                            <h2 className={styles.contractTitle}>{contract.title}</h2>
                            <h4 className={styles.contractLocation}>{contract.location}</h4>
                        </div>
                        {user.uid === contract.user.uid ?
                            <button className={styles.button} onClick={() => setShowApplicants(true)}>View Applicants</button>
                            :
                            contract.applicants?.find(applicant => applicant.uid === user.uid) ? <button className={styles.button} disabled>Applied</button> : <button className={styles.button} onClick={applyToContract}>Apply</button>}
                    </div>
                    {contract.skills.length > 0 && <div className={styles.contractSkills}>
                        <h4>Skills:</h4>&nbsp;{contract.skills.map(skill => skill.skill).join(', ')}
                    </div>}
                    <div className={styles.contractDescription}>
                        {contract.description.split('\n').map((line, i) => (
                            <Fragment key={i}>
                                {line}
                                <br />
                            </Fragment>
                        ))}
                    </div>
                    <div className={styles.contractInfoFooter}>
                        <div className={styles.contractTags}>
                            {contract.tags.map(tag => {
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
                    <Applicants contractSkills={contract.skills} applicants={contract.applicants} />
                </Modal>
            }
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={deleteContract}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your contract'
                />
            }
        </div>
    )
}

function Applicants(params: { contractSkills: SkillOption[], applicants: UserProfile[] | undefined }) {

    const { contractSkills, applicants } = params;

    const requestedSkills = contractSkills.map(skill => skill.skill);

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
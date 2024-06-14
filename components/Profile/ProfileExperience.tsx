import styles from '../styles/Profile/ProfileExperience.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileExperienceEditor from './ProfileExperienceEditor';
import Modal from '../Modal';
import useSWR, { mutate } from 'swr';
import Image from 'next/image';
import { User, UserProfile, UserSkill, WorkExperience } from '@/types';
import { toast } from 'sonner'
import ConfirmationPopup from '../ConfirmationPopup';
const fetcher = (url: string) => fetch(url).then(r => r.json())

const deleteExperience = async (id: number, onSuccess: () => void) => {
    const res = await fetch(`/api/profile/experiences/?id=${id}`, { method: 'DELETE' })

    if (!res.ok) {
        throw new Error("Failed to Delete Experience")
    }

    toast.success('Experience Deleted')
    onSuccess();

    return res.json();
}

export default function ProfileExperience(params: { pageUser: UserProfile, user: User }) {

    const { pageUser, user } = params;

    const { data: skillsData } = useSWR(`/api/profile/skills/user/?uid=${pageUser.uid}`, fetcher)

    const { data: experiencesData } = useSWR(`/api/profile/experiences/?uid=${pageUser.uid}`, fetcher)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditExperiences, setIsEditExperiences] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState<WorkExperience | undefined>(undefined);
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const toggleEditExperiences = () => {
        setIsEditExperiences(!isEditExperiences);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Experience</div>
                {user?.uid === pageUser?.uid &&
                    <div className={styles.modify}>
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleOpenModal} />
                        {!isEditExperiences ? <FontAwesomeIcon className={styles.icon} icon={faPen} onClick={toggleEditExperiences} />
                            : <FontAwesomeIcon className={styles.icon} icon={faXmark} onClick={toggleEditExperiences} />}
                    </div>
                }
            </div>

            <div className={styles.body}>
                {experiencesData?.map((experience: WorkExperience, index: number) => (
                    <div className={styles.experience} key={experience.id}>
                        <div className={styles.experienceTop}>
                            {experience.image &&
                                <Image
                                    className={styles.experienceImage}
                                    src={experience.image}
                                    alt={experience.company}
                                    width={150}
                                    height={150}
                                />
                            }
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceHeader}>
                                    <div className={styles.experienceTitle} title={experience.title}>{experience.title}</div>
                                    {isEditExperiences &&
                                        <div className={styles.icons}>
                                            <FontAwesomeIcon className={styles.editIcon} icon={faPen} onClick={() => { setSelectedExperience(experience); setIsEditModalOpen(true) }} />
                                            <FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} onClick={() => { setSelectedExperience(experience); setConfirmationPopup(true) }} />
                                        </div>
                                    }
                                </div>
                                <div className={styles.experienceCompany}>{experience.company}</div>
                                <div className={styles.experienceDate}>{new Date(experience.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })}{experience.current ? " - Present" : experience.end && " - " + new Date(experience.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })}</div>
                                {experience.skills && experience.skills.length > 0 &&
                                    <div className={styles.skills}>
                                        <div>Skills:&nbsp;</div>
                                        {experience.skills?.map((skill: UserSkill, index: number) => (
                                            <div className={styles.skill} key={skill.id}>{skill.name}{index !== (experience.skills ?? []).length - 1 && ','}&nbsp;</div>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                        {experience.description &&
                            <div className={styles.experienceBottom}>
                                <div className={styles.experienceDescription}>
                                    <ul>
                                        {experience?.description?.split('.\n').map((point: string, index: number) => (
                                            point !== " " && point !== "" && <li key={index}>{point.trim()}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                ))}
            </div>

            {
                isModalOpen && (
                    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} backIcon disableClickOff>
                        <ProfileExperienceEditor skills={skillsData} setModal={setIsModalOpen} updateSkillOptions={() => mutate(`/api/profile/skills/user/?uid=${pageUser.uid}`)} toastTrigger={() => toast.success("Experience Added")} onSuccess={() => mutate(`/api/profile/experiences/?uid=${pageUser.uid}`)} />
                    </Modal>
                )
            }

            {
                isEditModalOpen && (
                    <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} backIcon disableClickOff>
                        <ProfileExperienceEditor skills={skillsData} setModal={setIsEditModalOpen} updateSkillOptions={() => mutate(`/api/profile/skills/user/?uid=${pageUser.uid}`)} editMode experience={selectedExperience} toastTrigger={() => toast.success("Experience Updated")} onSuccess={() => mutate(`/api/profile/experiences/?uid=${pageUser.uid}`)} />
                    </Modal>
                )
            }

            {
                confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => { if (selectedExperience) deleteExperience(selectedExperience.id, () => mutate(`/api/profile/experiences/?uid=${pageUser.uid}`)) }}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your experience'
                />
            }
        </div >
    )
}
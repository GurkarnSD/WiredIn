import styles from '../styles/Profile/ProfileExperience.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileExperienceEditor from './ProfileExperienceEditor';
import Modal from '../Modal';
import useSWR from 'swr';
import Image from 'next/image';
import { User, UserProfile, UserSkill, WorkExperience } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json())

const deleteExperience = async (id: number) => {
    const res = await fetch(`/api/profile/experiences/?id=${id}`, { method: 'DELETE' })

    return res.json();
}

export default function ProfileExperience(params: { pageUser: UserProfile, user: User }) {

    const { pageUser, user } = params;

    const { data: skillsData } = useSWR(`/api/profile/skills/?uid=${pageUser.uid}`, fetcher)

    const { data: experiencesData } = useSWR(`/api/profile/experiences/?uid=${pageUser.uid}`, fetcher)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditExperiences, setIsEditExperiences] = useState(false);

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
                        <div className={styles.experienceHeader}>
                            <div className={styles.experienceLeft}>
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
                                    <div className={styles.experienceTitle}>{experience.title}</div>
                                    <div className={styles.experienceCompany}>{experience.company}</div>
                                    <div className={styles.experienceDate}>{new Date(experience.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })} - {experience.current ? "Present" : new Date(experience.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })}</div>
                                    {experience.skills && experience.skills.length > 0 &&
                                        <div className={styles.skills}>
                                            <div>Skills:&nbsp;</div>
                                            {skillsData?.map((skill: UserSkill, index: number) => (
                                                <div className={styles.skill} key={skill.id}>{skill.name}{index !== skillsData.length - 1 && ','}&nbsp;</div>
                                            ))}
                                        </div>
                                    }
                                </div>
                            </div>
                            {experience.description &&
                                <>
                                    <div className={styles.experienceDivider} />
                                    <div className={styles.experienceRight}>
                                        <div className={styles.experienceDescription}>{experience.description}</div>
                                    </div>
                                </>
                            }
                            {isEditExperiences && <FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} onClick={() => deleteExperience(experience.id)} />}
                        </div>
                        {index !== experiencesData.length - 1 && <div className={styles.horizontalDivider} />}
                    </div>
                ))}


            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} backIcon disableClickOff>
                    <ProfileExperienceEditor user={pageUser} skills={skillsData} />
                </Modal>
            )}
        </div>
    )
}
import styles from '../styles/Profile/ProfileSkills.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileSkillsEditor from './ProfileSkillsEditor';
import { AddSkillMenu } from './ProfileSkillsEditor';
import Modal from '../Modal';
import useSWR from 'swr';
import { User, UserProfile, UserSkill } from '@/types';
import { Toaster, toast } from 'sonner'
import ConfirmationPopup from '../ConfirmationPopup';
const fetcher = (url: string) => fetch(url).then(r => r.json())

const deleteSkill = async (id: number) => {
    const res = await fetch(`/api/profile/skills/user/?id=${id}`, { method: 'DELETE' })

    if (!res.ok) {
        throw new Error("Failed to Delete Skill")
    }

    toast.success('Skill Deleted')

    return res.json();
}

export default function ProfileSkills(params: { pageUser: UserProfile, user: User }) {

    const { pageUser, user } = params;

    const { data: userSkills } = useSWR(`/api/profile/skills/user/?uid=${pageUser.uid}`, fetcher)

    const { data: skillOptions } = useSWR(`/api/profile/skills`, fetcher)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditSkills, setIsEditSkills] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<UserSkill | undefined>(undefined);
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const toggleEditSkills = () => {
        setIsEditSkills(!isEditSkills);
    }

    return (
        <div className={styles.container}>
            <Toaster position='top-right' />
            <div className={styles.header}>
                <div className={styles.title}>Skills</div>
                {user?.uid === pageUser?.uid &&
                    <div className={styles.modify}>
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleOpenModal} />
                        {!isEditSkills ? <FontAwesomeIcon className={styles.icon} icon={faPen} onClick={toggleEditSkills} />
                            : <FontAwesomeIcon className={styles.icon} icon={faXmark} onClick={toggleEditSkills} />}
                    </div>
                }
            </div>

            <div className={styles.body}>
                {userSkills?.map((skill: UserSkill) => (
                    <div className={styles.skill} key={skill.id}>
                        <div>
                            <div className={styles.skillName}>{skill.name}</div>
                            <div className={styles.skillLearned}>Learned In {skill.learnedIn}</div>
                        </div>

                        {isEditSkills &&
                            <div className={styles.editControls}>
                                <FontAwesomeIcon className={styles.editIcon} icon={faPen} onClick={() => { setSelectedSkill(skill); setIsEditModalOpen(true) }} />
                                <FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} onClick={() => { setSelectedSkill(skill); setConfirmationPopup(true) }} />
                            </div>
                        }
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} backIcon disableClickOff>
                    <ProfileSkillsEditor skills={userSkills} skillOptions={skillOptions} toastTrigger={() => toast.success("Skill Added")} />
                </Modal>
            )}

            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} backIcon disableClickOff>
                    <AddSkillMenu controlModal={setIsEditModalOpen} skills={userSkills} skillOptions={[{ skill: selectedSkill?.name || '' }]} editMode skill={selectedSkill} toastTrigger={() => toast.success("Skill Updated")} />
                </Modal>
            )}

            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => { if (selectedSkill) deleteSkill(selectedSkill.id) }}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your skill'
                />
            }
        </div>
    )
}
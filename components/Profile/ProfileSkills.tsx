import styles from '../styles/Profile/ProfileSkills.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileSkillsEditor from './ProfileSkillsEditor';
import Modal from '../Modal';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json())

const deleteSkill = async (id: string) => {
    const res = await fetch(`/api/profile/skills/?id=${id}`, { method: 'DELETE' })

    return res.json();
}

export default function ProfileSkills(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    const { data, error } = useSWR(`/api/profile/skills/?uid=${pageUser.uid}`, fetcher)

    const skills = data;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditSkills, setIsEditSkills] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const toggleEditSkills = () => {
        setIsEditSkills(!isEditSkills);
    }

    return (
        <div className={styles.container}>
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
                {skills?.map((skill: any) => (
                    <div className={styles.skill} key={skill.skill}>
                        <div>
                            <div className={styles.skillName}>{skill.name}</div>
                            <div className={styles.skillLearned}>Learned In {skill.learnedIn}</div>
                        </div>
                        {isEditSkills && <FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} onClick={() => deleteSkill(skill.id)} />}
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ProfileSkillsEditor user={pageUser} skills={skills} />
                </Modal>
            )}
        </div>
    )
}
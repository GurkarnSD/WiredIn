import styles from '../styles/Profile/ProfileProjects.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faXmark, faTrash, faLink, faCode } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileProjectsEditor from './ProfileProjectsEditor';
import Modal from '../../components/Modal';
import useSWR from 'swr';
import Link from 'next/link';
import { User, UserProfile, UserProject } from '@/types';

const fetcher = (url: string) => fetch(url).then(r => r.json())

const deleteProject = async (id: number) => {
    const res = await fetch(`/api/profile/projects/?id=${id}`, { method: 'DELETE' })

    return res.json();
}

export default function ProfileProjects(params: { pageUser: UserProfile, user: User }) {

    const { pageUser, user } = params;

    const { data: skillsData } = useSWR(`/api/profile/skills/user/?uid=${pageUser.uid}`, fetcher)

    const { data: projectsData } = useSWR(`/api/profile/projects/?uid=${pageUser.uid}`, fetcher)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditProjects, setIsEditProjects] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const toggleEditProjects = () => {
        setIsEditProjects(!isEditProjects);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Projects</div>
                {user?.uid === pageUser?.uid &&
                    <div className={styles.modify}>
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleOpenModal} />
                        {!isEditProjects ? <FontAwesomeIcon className={styles.icon} icon={faPen} onClick={toggleEditProjects} />
                            : <FontAwesomeIcon className={styles.icon} icon={faXmark} onClick={toggleEditProjects} />}
                    </div>
                }
            </div>

            <div className={styles.body}>
                {projectsData?.map((project: UserProject) => (
                    <div className={styles.project} key={project.id}>
                        <div className={styles.projectHeader}>
                            <div className={styles.projectTitle}>{project.title}</div>
                            {project.deployment && <Link href={project.deployment}>
                                <FontAwesomeIcon className={styles.projectIcon} icon={faLink} />
                            </Link>}
                            {project.source && <Link href={project.source}>
                                <FontAwesomeIcon className={styles.projectIcon} icon={faCode} />
                            </Link>}
                            {isEditProjects && <FontAwesomeIcon className={styles.deleteIcon} icon={faTrash} onClick={() => deleteProject(project.id)} />}
                        </div>
                        <div className={styles.projectDate}>{new Date(project.start).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })} - {project.current ? "Present" : new Date(project.end).toLocaleDateString('en-US', { year: 'numeric', month: 'short', timeZone: 'UTC' })}</div>
                        <div className={styles.projectDescription}>
                            <ul>
                                {project?.description?.split('.').map((point: string, index: number) => (
                                    point !== " " && point !== "" && <li key={index}>{point.trim()}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} backIcon disableClickOff>
                    <ProfileProjectsEditor user={pageUser} skills={skillsData} setModal={setIsModalOpen} />
                </Modal>
            )}
        </div>
    )
}
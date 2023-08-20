import styles from '../styles/Profile/ProfileProjects.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileProjectsEditor from './ProfileProjectsEditor';
import Modal from '../../components/Modal';

export default function ProfileProjects(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Projects</div>
                {user?.uid === pageUser?.uid &&
                    <div className={styles.modify}>
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleOpenModal} />
                        <FontAwesomeIcon className={styles.icon} icon={faPen} />
                    </div>
                }
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ProfileProjectsEditor user={pageUser} />
                </Modal>
            )}
        </div>
    )
}
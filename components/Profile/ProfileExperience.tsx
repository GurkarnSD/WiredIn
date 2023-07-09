import styles from '../styles/Profile/ProfileExperience.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import ProfileExperienceEditor from './ProfileExperienceEditor';
import Modal from '../Modal';

export default function ProfileExperience(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Experience</div>
                {user?.uid === pageUser?.uid &&
                    <div className={styles.modify}>
                        <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleOpenModal} />
                        <FontAwesomeIcon className={styles.icon} icon={faPen} />
                    </div>
                }
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ProfileExperienceEditor user={pageUser} />
                </Modal>
            )}
        </div>
    )
}
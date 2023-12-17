import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import ProfileHeaderEditor from './ProfileHeaderEditor';
import styles from '../styles/Profile/ProfileHeader.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const followUser = async (userId: string, pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "POST",
        body: JSON.stringify({
            user: userId,
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to follow user")
    }

    return res.json()
}

const unfollowUser = async (userId: string, pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "PUT",
        body: JSON.stringify({
            user: userId,
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unfollow user")
    }

    return res.json()
}

const fetchHeaderImages = async (bannerKey: string, profileKey: string) => {
    const response1 = await fetch(`/api/image/${bannerKey}`);
    const { url: bannerURL } = await response1.json();

    const response2 = await fetch(`/api/image/${profileKey}`);
    const { url: profileURL } = await response2.json();

    return { bannerURL, profileURL };
}

export default function ProfileHeader(params: { pageUser: any, user: any }) {

    const { pageUser, user } = params;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [headerImages, setHeaderImages] = useState({
        bannerURL: '',
        profileURL: '',
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchImages = async () => {
            const images = await fetchHeaderImages(pageUser.bannerPic, pageUser.profilePic);
            setHeaderImages(images);
        };

        fetchImages();
    }, [pageUser.bannerPic, pageUser.profilePic]);

    return (
        <div className={styles.container}>
            <Image className={styles.banner} src={headerImages.bannerURL} alt={""} height={240} width={1152} />
            <div className={styles.profile}>
                <Image className={styles.profilePicture} src={headerImages.profileURL} alt={""} width={224} height={224} />

                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.header}>
                            <div className={styles.displayName}>{pageUser?.displayName}</div>
                            {user?.uid !== pageUser?.uid ? (
                                !pageUser?.followers.some((follower: { uid: string }) => follower.uid === user?.uid) ?
                                    <button className={styles.follow} onClick={() => followUser(user.uid, pageUser?.uid)}>Follow</button>
                                    : <button className={styles.follow} onClick={() => unfollowUser(user.uid, pageUser?.uid)}>Unfollow</button>)
                                : null}
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>{pageUser?.following.length}</div>
                                &nbsp;Following
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNumber}>{pageUser?.followers.length}</div>
                                &nbsp;Followers
                            </div>
                        </div>
                    </div>

                    <div className={styles.dividerLine} />

                    <div className={styles.contentRight}>
                        <div className={styles.row}>
                            <div className={styles.title}>{pageUser?.title}</div>
                            <div className={styles.icons}>
                                <Link href={`https://github.com/${pageUser.github}`}>
                                    <FontAwesomeIcon className={styles.icon} icon={faGithub} />
                                </Link>
                                {user?.uid === pageUser?.uid &&
                                    <FontAwesomeIcon className={styles.iconEdit} icon={faEdit} onClick={handleOpenModal} />
                                }
                            </div>
                        </div>
                        <div className={styles.bio}>{pageUser?.bio}</div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <ProfileHeaderEditor user={pageUser} userImages={headerImages}/>
                </Modal>
            )}
        </div >
    )
}
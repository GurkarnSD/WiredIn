import React, { useState, useEffect } from 'react';
import Modal from '../../components/Modal';
import ProfileHeaderEditor from './ProfileHeaderEditor';
import styles from '../styles/Profile/ProfileHeader.module.css';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, UserProfile } from '@/types';

const followUser = async (pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "POST",
        body: JSON.stringify({
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to follow user")
    }

    return res.json()
}

const unfollowUser = async (pageUserId: string) => {
    const res = await fetch('/api/follow', {
        method: "PUT",
        body: JSON.stringify({
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unfollow user")
    }

    return res.json()
}

const messageUser = async (pageUserId: string) => {
    const res = await fetch('/api/chatroom', {
        method: "POST",
        body: JSON.stringify({
            otherUser: pageUserId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to setup chatroom")
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

const checkFollowing = async (pageUserId: string) => {
    const res = await fetch(`/api/follow?otherUser=${pageUserId}`)

    if (!res.ok) {
        throw new Error("Failed to check following")
    }

    return res.json()
}

export default function ProfileHeader(params: { pageUser: UserProfile, user: User }) {

    const { pageUser, user } = params;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [showFollowers, setShowFollowers] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { push } = useRouter();

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

    useEffect(() => {
        const checkIfFollowing = async () => {
            if (user) {
                const following = await checkFollowing(pageUser.uid);
                setIsFollowing(following.response);
            }
        };

        checkIfFollowing();
    }, [user, pageUser.uid]);

    return (
        <div className={styles.container}>
            <Image className={styles.banner} src={headerImages.bannerURL} alt={""} height={0} width={0} unoptimized />
            <div className={styles.icons}>
                {pageUser.github ? (
                    <Link href={`https://github.com/${pageUser.github}`} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon className={styles.icon} icon={faGithub} />
                    </Link>
                ) : (
                    <div className={styles.iconPlaceholder}></div>
                )}
                {user?.uid === pageUser?.uid &&
                    <FontAwesomeIcon className={styles.iconEdit} icon={faEdit} onClick={handleOpenModal} />
                }
            </div>
            <div className={styles.profile}>
                <Image className={styles.profilePicture} src={headerImages.profileURL} alt={""} width={224} height={224} />
                <div className={styles.content}>
                    <div className={styles.contentLeft}>
                        <div className={styles.header}>
                            <div className={styles.displayName}>{pageUser?.displayName}</div>
                            <div className={styles.userTitle}>{pageUser?.title}</div>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.stat} onClick={() => setShowFollowing(true)}>
                                <div className={styles.statNumber}>{pageUser?._count?.following}</div>
                                &nbsp;Following
                            </div>
                            <div className={styles.stat} onClick={() => setShowFollowers(true)}>
                                <div className={styles.statNumber}>{pageUser?._count?.followers}</div>
                                &nbsp;Followers
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentRight}>
                        {user?.uid !== pageUser?.uid ? (
                            !isFollowing ?
                                <button className={styles.follow} onClick={() => { followUser(pageUser?.uid); setIsFollowing(true) }}>Follow</button>
                                : <button className={styles.follow} onClick={() => { unfollowUser(pageUser?.uid); setIsFollowing(false) }}>Unfollow</button>)
                            : null}
                        <button className={styles.message} onClick={async () => { await messageUser(pageUser?.uid); push('/messages') }}>Message</button>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} backIcon disableClickOff>
                    <ProfileHeaderEditor user={pageUser} userImages={headerImages} setModal={setIsModalOpen} />
                </Modal>
            )}

            {showFollowing && (
                <Modal isOpen={showFollowing} onClose={() => setShowFollowing(false)} backIcon disableClickOff>
                    <UserList following pageUser={pageUser.uid} user={user.uid} />
                </Modal>
            )}

            {showFollowers && (
                <Modal isOpen={showFollowers} onClose={() => setShowFollowers(false)} backIcon disableClickOff>
                    <UserList followers pageUser={pageUser.uid} user={user.uid} />
                </Modal>
            )}
        </div >
    )
}

const getFollowers = async (user: string) => {
    const res = await fetch(`/api/follow/followers?user=${user}`, {
        method: "GET",
    })

    if (!res.ok) {
        throw new Error("Failed to get followers")
    }

    return res.json()
}

const getFollowing = async (user: string) => {
    const res = await fetch(`/api/follow/following?user=${user}`, {
        method: "GET",
    })

    if (!res.ok) {
        throw new Error("Failed to get following")
    }

    return res.json()
}

function UserList(params: { followers?: boolean, following?: boolean, pageUser: string, user: string }) {

    const { followers, following, pageUser, user } = params;

    let title = "";
    if (followers) {
        title = "Followers";
    } else if (following) {
        title = "Following";
    }

    interface UserProfileWithFollowing extends UserProfile {
        sessionUserFollows?: boolean;
    }

    const [userList, setUserList] = useState<UserProfileWithFollowing[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (followers) {
                const followers = await getFollowers(pageUser);
                setUserList(followers.response);
            } else if (following) {
                const following = await getFollowing(pageUser);
                setUserList(following.response);
            }
        };

        fetchUsers();
    }, [followers, following]);

    const followUserAndUpdateList = async (userId: string) => {
        try {
            await followUser(userId);
            const updatedList = userList.map(member => {
                if (member.uid === userId) {
                    return { ...member, sessionUserFollows: true };
                }
                return member;
            });
            setUserList(updatedList);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const unfollowUserAndUpdateList = async (userId: string) => {
        try {
            await unfollowUser(userId);
            const updatedList = userList.map(member => {
                if (member.uid === userId) {
                    return { ...member, sessionUserFollows: false };
                }
                return member;
            });
            setUserList(updatedList);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    return (
        <div className={styles.usersContainer}>
            <div className={styles.usersHeader}>
                <h1 className={styles.title}>{title}</h1>
            </div>
            <div className={styles.usersBody}>
                {userList && userList?.map((member: UserProfileWithFollowing) => {
                    return (
                        <div key={member.uid} className={styles.user}>
                            <Link href={`/profile/${member.displayName}`}>
                                <div className={styles.userInfoGroup}>
                                    <Image className={styles.userImage} src={member.profilePic} alt='User Image' width={50} height={50} />
                                    <div className={styles.userInfo}>
                                        <h2 className={styles.userName}>{member.displayName}</h2>
                                    </div>
                                </div>
                            </Link>
                            {member.uid !== user ? !member.sessionUserFollows ?
                                <button className={styles.follow} onClick={() => { followUserAndUpdateList(member.uid); }}>Follow</button>
                                : <button className={styles.follow} onClick={() => { unfollowUserAndUpdateList(member.uid); }}>Unfollow</button>
                                : null}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
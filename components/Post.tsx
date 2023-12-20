'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "./styles/Post.module.css";
import Modal from './Modal';
import { useState, useEffect } from 'react';

const likePost = async (userId: string, postId: number) => {
    const res = await fetch('/api/feed/like', {
        method: "POST",
        body: JSON.stringify({
            uid: userId,
            postId: postId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to like post")
    }

    return res.json()
}

const unlikePost = async (userId: string, postId: number) => {
    const res = await fetch('/api/feed/like', {
        method: "DELETE",
        body: JSON.stringify({
            uid: userId,
            postId: postId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unlike post")
    }

    return res.json()
}

const fetchProfileImage = async (profileKey: string) => {
    const response = await fetch(`/api/image/${profileKey}`);
    const { url: profileURL } = await response.json();
    return profileURL;
}

const calculateImageGrid = (images: string[]) => {
    let gridType = '';

    switch (images.length) {
        case 1:
            gridType = 'oneImage';
            break;
        case 2:
            gridType = 'twoImages';
            break;
        case 3:
            gridType = 'threeImages';
            break;
        case 4:
            gridType = 'fourImages';
            break;
    }
    return gridType;
}

const calculateImageClass = (images: string[], index: number) => {
    if (images.length === 1) {
        return styles.largeImage;
    } else if (images.length === 2) {
        return styles.medImage;
    } else if (index === 0 && images.length === 3) {
        return styles.med1Image;
    } else if (index == 0) {
        return styles.largeImage;
    } else if (images.length === 3) {
        return styles.med2Image
    } else {
        return styles.smallImage
    }
}

export default function Post(params: { post: any, session: any }) {

    const { post, session } = params;

    const user = session?.user;

    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            const image = await fetchProfileImage(user.profilePic);
            setProfilePic(image);
        };
        if (user) fetchImage();
    }, [user?.profilePic]);

    const [liked, setLiked] = useState(post.likes.some((like: { uid: string }) => like.uid === user.uid))
    const [numLikes, setNumLikes] = useState(post._count.likes);
    const numComments = post._count.comments;
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [charCount, setCharCount] = useState(0);
    const maxChars = 1200;

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCharCount(event.target.value.length);
        setInput(event.target.value);
    };

    const handleSubmit = async () => {
        if (input.length == 0) {
            return;
        }

        const res = await fetch('/api/feed/comments', {
            method: 'POST',
            body: JSON.stringify({
                uid: user.uid,
                postId: post.uid,
                text: input,
            }),
        });

        if (!res.ok) {
            throw new Error('Failed to Comment');
        }

        setInput('');
        setCharCount(0);
        return res.json();
    };

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setImageModalOpen(false);
    };

    const likePostHook = async (userId: string, postId: number) => {
        try {
            await likePost(userId, postId);
            setLiked(true);
            setNumLikes(numLikes + 1);
        } catch (error) {
            console.log(error)
        }
    }

    const unlikePostHook = async (userId: string, postId: number) => {
        try {
            await unlikePost(userId, postId);
            setLiked(false);
            setNumLikes(numLikes - 1);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.postContainer}>
                <div className={styles.postHeader}>
                    <div className={styles.postHeaderLeft}>
                        <Image className={styles.profilePic} src={post.user.profilePic} alt={""} height={50} width={50} />
                        <div className={styles.postInfo}>
                            <div className={styles.displayName}>{post.user.displayName}</div>
                            <div className={styles.profileTitle}>{post.user.title}</div>
                        </div>
                    </div>
                    <div className={styles.postHeaderRight}>
                        <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(post.createdAt)}</div>
                    </div>
                </div>
                <div className={styles.postBody}>
                    <div className={styles.images}>
                        {post.images.length > 0 &&
                            <div className={`${styles.imagesContainer} ${styles[calculateImageGrid(post.images)]}`}>
                                <div className={styles.imageContainer} onClick={() => openImageModal(post.images[0])}>
                                    <Image className={`${styles.image} ${calculateImageClass(post.images, 0)}`} src={post.images[0]} alt={''} width={0} height={0} unoptimized />
                                </div>
                                <div className={styles.imagesContainer2}>
                                    {post.images.slice(1).map((image: string, index: number) => {
                                        return (
                                            <div key={image} className={styles.imageContainer} onClick={() => openImageModal(image)}>
                                                <Image className={`${styles.image} ${calculateImageClass(post.images, index + 1)}`} src={image} alt={''} width={0} height={0} unoptimized />
                                            </div>
                                        );
                                    })}
                                </div>
                                {imageModalOpen && selectedImage && (
                                    <Modal isOpen={imageModalOpen} onClose={closeImageModal} closeIcon>
                                        <div className={styles.modalImageContainer}>
                                            <Image className={styles.modalImage} src={selectedImage} alt={''} width={0} height={0} sizes="100vw" />
                                        </div>
                                    </Modal>
                                )}
                            </div>
                        }
                    </div>
                    <div className={styles.text}>{post.text}</div>
                </div>
                <div className={styles.postFooter}>
                    <div>
                        {liked ?
                            <FontAwesomeIcon className={`${styles.postIcon} ${styles.liked}`} icon={faHeart} onClick={() => unlikePostHook(user.uid, post.uid)} />
                            :
                            <FontAwesomeIcon className={styles.postIcon} icon={faHeart} onClick={() => likePostHook(user.uid, post.uid)} />
                        }
                        <span className={styles.iconCount}>{numLikes}</span>
                    </div>
                    <div>
                        <FontAwesomeIcon className={styles.postIcon} icon={faComment} />
                        <span className={styles.iconCount}>{numComments}</span>
                    </div>
                </div>
                <div className={styles.commentBody}>
                    {post.comments.map((comment: {
                        id: number;
                        text: string;
                        createdAt: string;
                        user: {
                            displayName: string;
                            profilePic: string;
                        };
                    }) => (
                        <div className={styles.comment} key={comment.id}>
                            <div className={styles.commentHeader}>
                                <Image className={styles.profilePic} src={comment.user.profilePic} width={50} height={50} alt='Profile Pic' />
                                <div className={styles.commenterName}>{comment.user.displayName}</div>
                                <div className={styles.commentTime} suppressHydrationWarning={true}>{formatTimeDifference(comment.createdAt)}</div>
                            </div>
                            <div className={styles.commentText}>{comment.text}</div>
                        </div>
                    ))}
                </div>
                <div className={styles.commentFooter}>
                    <Image className={styles.profilePic} src={profilePic} width={50} height={50} alt='Profile Pic' />
                    <input className={styles.addComment} placeholder='Post a comment...' name='input' value={input} onChange={handleInputChange} />
                    <div className={`${styles.charCount} ${charCount > maxChars && styles.overMaxChars}`}>{charCount}/{maxChars}</div>
                    <FontAwesomeIcon className={styles.sendComment} icon={faPaperPlane} onClick={handleSubmit} />
                </div>
            </div>
        </div>
    )
}

function formatTimeDifference(createdAt: string): string {
    const currentDateTime = new Date();
    const createdDateTime = new Date(createdAt);

    const timeDifferenceInSeconds = Math.floor((currentDateTime.getTime() - createdDateTime.getTime()) / 1000);

    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} second${timeDifferenceInSeconds !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInMinutes = Math.floor(timeDifferenceInSeconds / 60);

    if (timeDifferenceInMinutes < 60) {
        return `${timeDifferenceInMinutes} minute${timeDifferenceInMinutes !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInHours = Math.floor(timeDifferenceInMinutes / 60);

    if (timeDifferenceInHours < 24) {
        return `${timeDifferenceInHours} hour${timeDifferenceInHours !== 1 ? 's' : ''} ago`;
    }

    const timeDifferenceInDays = Math.floor(timeDifferenceInHours / 24);

    return timeDifferenceInDays < 30
        ? `${timeDifferenceInDays} day${timeDifferenceInDays !== 1 ? 's' : ''} ago`
        : createdDateTime.toISOString().slice(0, 10);
}

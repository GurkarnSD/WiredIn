import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "../styles/Feed/Post.module.css";
import Modal from '../Modal';
import { useState, useRef } from 'react';

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

export default function Post(params: { data: any, uid: any }) {

    const { data, uid } = params;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <div className={styles.postHeaderLeft}>
                    <Image className={styles.postProfile} src={data.user.profilePic} alt={""} height={50} width={50} />
                    <div className={styles.postInfo}>
                        <div className={styles.displayName}>{data.user.displayName}</div>
                        <div className={styles.profileTitle}>{data.user.title}</div>
                    </div>
                </div>
                <div className={styles.postHeaderRight}>
                    <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(data.createdAt)}</div>
                </div>
            </div>
            <div className={styles.postBody}>
                <div className={styles.images}>
                    {data.images.length > 0 &&
                        <div className={`${styles.imagesContainer} ${styles[calculateImageGrid(data.images)]}`}>
                            <div className={styles.imageContainer} onClick={() => openImageModal(data.images[0])}>
                                <Image className={`${styles.image} ${calculateImageClass(data.images, 0)}`} src={data.images[0]} alt={''} width={0} height={0} unoptimized />
                            </div>
                            <div className={styles.imagesContainer2}>
                                {data.images.slice(1).map((image: string, index: number) => {
                                    return (
                                        <div key={image} className={styles.imageContainer} onClick={() => openImageModal(image)}>
                                            <Image className={`${styles.image} ${calculateImageClass(data.images, index + 1)}`} src={image} alt={''} width={0} height={0} unoptimized />
                                        </div>
                                    );
                                })}
                            </div>
                            {isModalOpen && selectedImage && (
                                <Modal isOpen={isModalOpen} onClose={closeImageModal}>
                                    <div className={styles.modalImageContainer}>
                                        <Image className={styles.modalImage} src={selectedImage} alt={''} width={0} height={0} sizes="100vw" />
                                    </div>
                                </Modal>
                            )}
                        </div>
                    }
                </div>
                <div className={styles.text}>{data.text}</div>
            </div>
            <div className={styles.postFooter}>
                <div>
                    {data.likes.some((like: { uid: string }) => like.uid === uid) ?
                        <FontAwesomeIcon className={`${styles.postIcon} ${styles.liked}`} icon={faHeart} onClick={() => unlikePost(uid, data.id)} />
                        :
                        <FontAwesomeIcon className={styles.postIcon} icon={faHeart} onClick={() => likePost(uid, data.id)} />
                    }
                    <span className={styles.iconCount}>{data._count.likes}</span>
                </div>
                <div>
                    <FontAwesomeIcon className={styles.postIcon} icon={faComment} />
                    <span className={styles.iconCount}></span>
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

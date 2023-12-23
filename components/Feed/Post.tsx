import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "../styles/Feed/Post.module.css";
import Modal from '../Modal';
import { useState } from 'react';
import Comments from "./Comments";
import { useRouter } from "next/navigation";

const likePost = async (userId: string, postId: string) => {
    const res = await fetch('/api/feed/like/post', {
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

const unlikePost = async (userId: string, postId: string) => {
    const res = await fetch('/api/feed/like/post', {
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

    const [liked, setLiked] = useState(data.likes.some((like: { uid: string }) => like.uid === uid))
    const [numLikes, setNumLikes] = useState(data._count.likes);
    const numComments = data._count.comments;

    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const router = useRouter();

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setImageModalOpen(false);
    };

    const likePostHook = async (userId: string, postId: string) => {
        try {
            await likePost(userId, postId);
            setLiked(true);
            setNumLikes(numLikes + 1);
        } catch (error) {
            console.log(error)
        }
    }

    const unlikePostHook = async (userId: string, postId: string) => {
        try {
            await unlikePost(userId, postId);
            setLiked(false);
            setNumLikes(numLikes - 1);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.postContainer} onClick={() => router.push(`/post/${data.uid}`)}>
            <div className={styles.postHeader}>
                <div className={styles.postHeaderLeft}>
                    <Image className={styles.postProfile} src={data.user.profilePic} alt={""} height={50} width={50} onClick={(e) => { e.stopPropagation(); router.push(`/profile/${data.user.displayName}`) }} />
                    <div className={styles.postInfo}>
                        <div className={styles.displayName} onClick={(e) => { e.stopPropagation(); router.push(`/profile/${data.user.displayName}`) }}>{data.user.displayName}</div>
                        <div className={styles.profileTitle}>{data.user.title}</div>
                    </div>
                </div>
                <div className={styles.postHeaderRight}>
                    <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(data.createdAt)}</div>
                </div>
            </div>
            <div className={styles.postBody} onClick={(e) => e.stopPropagation()}>
                <div className={styles.text}>{data.text}</div>
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
            </div>
            <div className={styles.postFooter} onClick={(e) => e.stopPropagation()}>
                <div>
                    {liked ?
                        <FontAwesomeIcon className={`${styles.postIcon} ${styles.liked}`} icon={faHeart} onClick={() => unlikePostHook(uid, data.uid)} />
                        :
                        <FontAwesomeIcon className={styles.postIcon} icon={faHeart} onClick={() => likePostHook(uid, data.uid)} />
                    }
                    <span className={styles.iconCount}>{numLikes}</span>
                </div>
                <div>
                    <FontAwesomeIcon className={styles.postIcon} icon={faComment} onClick={() => setCommentsModalOpen(true)} />
                    <span className={styles.iconCount}>{numComments}</span>
                </div>
                <FontAwesomeIcon className={styles.moreIcon} icon={faEllipsisVertical} />
            </div>
            {commentsModalOpen &&
                <div className={styles.comments} onClick={(e) => e.stopPropagation()}>
                    <Modal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} closeIcon disableClickOff>
                        <Comments postId={data.uid} user={data.user} />
                    </Modal>
                </div>
            }
        </div >
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

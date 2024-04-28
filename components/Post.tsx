'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faPaperPlane, faReply, faAngleUp, faAngleDown, faCircleXmark, faEllipsisVertical, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import styles from "./styles/Post.module.css";
import Modal from './Modal';
import { useState, useEffect, useRef } from 'react';
import { CommentResponse, PostComment, User, UserPost } from "@/types";
import PostSettings from "./Feed/PostSettings";
import PostCreator from "./Feed/PostCreator";
import { Toaster, toast } from 'sonner'
import CommentSettings from "./Feed/CommentSettings";
import ResponseSettings from "./Feed/ResponseSettings";

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

const fetchComments = async (uid: string) => {
    const res = await fetch(`/api/feed/comments/?uid=${uid}`)

    if (!res.ok) {
        throw new Error("Failed to fetch comments")
    }

    const comments = await res.json()

    return comments
}

const fetchResponses = async (id: number) => {
    const res = await fetch(`/api/feed/responses/?id=${id}`)

    if (!res.ok) {
        throw new Error("Failed to fetch responses")
    }

    const responses = await res.json()

    return responses
}

const likeComment = async (userId: string, commentId: number) => {
    const res = await fetch('/api/feed/like/comment', {
        method: "POST",
        body: JSON.stringify({
            uid: userId,
            commentId: commentId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to like comment")
    }

    return res.json()
}

const unlikeComment = async (userId: string, commentId: number) => {
    const res = await fetch('/api/feed/like/comment', {
        method: "DELETE",
        body: JSON.stringify({
            uid: userId,
            commentId: commentId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unlike comment")
    }

    return res.json()
}

const likeResponse = async (userId: string, responseId: number) => {
    const res = await fetch('/api/feed/like/response', {
        method: "POST",
        body: JSON.stringify({
            uid: userId,
            responseId: responseId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to like response")
    }

    return res.json()
}

const unlikeResponse = async (userId: string, responseId: number) => {
    const res = await fetch('/api/feed/like/response', {
        method: "DELETE",
        body: JSON.stringify({
            uid: userId,
            responseId: responseId
        })
    })

    if (!res.ok) {
        throw new Error("Failed to unlike response")
    }

    return res.json()
}

type PostWithStats = UserPost & {
    likes: { uid: string }[];
    _count: {
        likes: number;
        comments: number;
    };
    comments: PostCommentWithStats[];
};

type PostCommentWithStats = PostComment & {
    likes: { uid: string }[];
    _count: {
        likes: number;
        responses: number;
    };
};

type CommentResponseWithStats = CommentResponse & {
    likes: { uid: string }[];
    _count: {
        likes: number;
    };
};

export default function Post(params: { post: PostWithStats, user: User }) {

    const { post, user } = params;
    const [profilePic, setProfilePic] = useState('');
    const [comments, setComments] = useState([]);
    const [responses, setResponses] = useState<Record<number, CommentResponseWithStats[]>>({});
    const [openResponses, setOpenResponses] = useState<Record<number, boolean>>({});
    const [selectedComment, setSelectedComment] = useState<PostCommentWithStats | null>(null);
    const [editComment, setEditComment] = useState<PostCommentWithStats | null>(null);
    const [editResponse, setEditResponse] = useState<CommentResponseWithStats | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showPostSettings, setShowPostSettings] = useState(false);
    const settingsRef = useRef(null);
    HandleCloseSettings(settingsRef, setShowPostSettings);

    const toggleResponses = async (commentId: number) => {
        if (!responses[commentId]) {
            const newResponses = await fetchResponses(commentId);
            setResponses((prev) => ({
                ...prev,
                [commentId]: newResponses,
            }));
        }

        setOpenResponses((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

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

    useEffect(() => {
        if (editComment) {
            setSelectedComment(null);
            setEditResponse(null);
            setInput(editComment.text);
            setCharCount(editComment.text.length);
        }
    }, [editComment]);

    useEffect(() => {
        if (editResponse) {
            setSelectedComment(null);
            setEditComment(null);
            setInput(editResponse.text);
            setCharCount(editResponse.text.length);
        }
    }, [editResponse]);

    const handleUpdateSubmit = async () => {
        if (input.length == 0) {
            return;
        }

        if (editComment) {
            const res = await fetch('/api/feed/comments', {
                method: 'PUT',
                body: JSON.stringify({
                    commentId: editComment.id,
                    text: input,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to Update Comment');
            } else {
                setInput('');
                setCharCount(0);
                setEditComment(null);
                setComments(await fetchComments(post.uid));
            }

            return res.json();
        }

        if (editResponse) {
            const res = await fetch('/api/feed/responses', {
                method: 'PUT',
                body: JSON.stringify({
                    responseId: editResponse.id,
                    text: input,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to Update Response');
            } else {
                setInput('');
                setCharCount(0);
                setEditResponse(null);
            }

            return res.json();
        }
    };


    const handleSubmit = async () => {
        if (input.length == 0) {
            return;
        }

        if (selectedComment) {
            const res = await fetch('/api/feed/responses', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user.uid,
                    commentId: selectedComment.id,
                    text: input,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to Respond');
            } else {
                setInput('');
                setCharCount(0);
                setSelectedComment(null);
            }

            return res.json();
        } else {
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
            } else {
                setInput('');
                setCharCount(0);
            }

            return res.json();
        }
    };

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

    const [likedComments, setLikedComments] = useState<Record<number, boolean>>({});
    const [commentNumLikes, setCommentNumLikes] = useState<Record<number, number>>({});

    useEffect(() => {
        const newLiked: Record<number, boolean> = {};
        const newNumLikes: Record<number, number> = {};

        post.comments.forEach((comment: PostCommentWithStats) => {
            newLiked[comment.id] = comment.likes.some((like: { uid: string }) => like.uid === user.uid);
            newNumLikes[comment.id] = comment._count.likes;
        });

        setLikedComments(newLiked);
        setCommentNumLikes(newNumLikes);
    }, [post.comments]);

    const likeCommentHook = async (userId: string, commentId: number) => {
        try {
            await likeComment(userId, commentId);
            setLikedComments((prev) => ({
                ...prev,
                [commentId]: true,
            }));
            setCommentNumLikes((prev) => ({
                ...prev,
                [commentId]: prev[commentId] + 1,
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const unlikeCommentHook = async (userId: string, commentId: number) => {
        try {
            await unlikeComment(userId, commentId);
            setLikedComments((prev) => ({
                ...prev,
                [commentId]: false,
            }));
            setCommentNumLikes((prev) => ({
                ...prev,
                [commentId]: prev[commentId] - 1,
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const [likedResponses, setLikedResponses] = useState<Record<number, boolean>>({});
    const [responseNumLikes, setResponseNumLikes] = useState<Record<number, number>>({});

    useEffect(() => {
        const newLiked: Record<number, boolean> = {};
        const newNumLikes: Record<number, number> = {};

        Object.values(responses).forEach((responseArray: CommentResponseWithStats[]) => {
            responseArray.forEach((response: CommentResponseWithStats) => {
                newLiked[response.id] = response.likes.some((like: { uid: string }) => like.uid === user.uid);
                newNumLikes[response.id] = response._count.likes;
            });
        });

        setLikedResponses(newLiked);
        setResponseNumLikes(newNumLikes);
    }, [responses]);

    const likeResponseHook = async (userId: string, responseId: number) => {
        try {
            await likeResponse(userId, responseId);
            setLikedResponses((prev) => ({
                ...prev,
                [responseId]: true,
            }));
            setResponseNumLikes((prev) => ({
                ...prev,
                [responseId]: prev[responseId] + 1,
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const unlikeResponseHook = async (userId: string, responseId: number) => {
        try {
            await unlikeResponse(userId, responseId);
            setLikedResponses((prev) => ({
                ...prev,
                [responseId]: false,
            }));
            setResponseNumLikes((prev) => ({
                ...prev,
                [responseId]: prev[responseId] - 1,
            }));
        } catch (error) {
            console.log(error)
        }
    }

    const [showCommentSettings, setShowCommentSettings] = useState<Record<number, boolean>>({});
    const [showResponseSettings, setShowResponseSettings] = useState<Record<number, boolean>>({});

    return (
        <div className={styles.container}>
            <Toaster position="top-right" />
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
                {post.createdAt.getTime() !== post.updatedAt.getTime() && <div className={styles.edited}>Edited</div>}
                <div className={styles.postBody}>
                    <div className={styles.text}>{post.text}</div>
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
                    <div className={styles.postOptions} ref={settingsRef}>
                        <FontAwesomeIcon className={styles.moreIcon} icon={faEllipsisVertical} onClick={() => setShowPostSettings(!showPostSettings)} />
                        {showPostSettings && <PostSettings uid={user.uid} post={post} openEditModal={setIsEditModalOpen} />}
                    </div>
                </div>
                <div className={styles.commentBody}>
                    {post.comments.map((comment: PostCommentWithStats) => (
                        <div className={styles.comment} key={comment.id}>
                            <div className={styles.commentHeader}>
                                <Image className={styles.profilePic} src={comment.user.profilePic} width={40} height={40} alt='Profile Pic' />
                                <div className={styles.commenterName}>{comment.user.displayName}</div>
                                <div className={styles.commentTime} suppressHydrationWarning={true}>{formatTimeDifference(comment.createdAt)}</div>
                            </div>
                            {comment.createdAt.getTime() !== comment.updatedAt.getTime() && <div className={styles.editedComment}>Edited</div>}
                            <div className={styles.commentContent}>
                                <div className={styles.commentText}>{comment.text}</div>
                                <div className={styles.commentControls}>
                                    <div className={styles.likeComment}>
                                        <span className={styles.commentCount}>{commentNumLikes[comment.id]}</span>
                                        {likedComments[comment.id] ?
                                            <FontAwesomeIcon className={`${styles.commentIcon} ${styles.liked}`} icon={faHeart} onClick={() => unlikeCommentHook(user.uid, comment.id)} />
                                            :
                                            <FontAwesomeIcon className={styles.commentIcon} icon={faHeart} onClick={() => likeCommentHook(user.uid, comment.id)} />
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className={styles.commentFooter}>
                                <FontAwesomeIcon className={styles.replyIcon} icon={faReply} onClick={() => setSelectedComment(comment)} />
                                {comment._count.responses > 0 && openResponses[comment.id] ?
                                    <div className={styles.replyControl} onClick={() => toggleResponses(comment.id)}>
                                        <FontAwesomeIcon className={styles.responsesIcon} icon={faAngleDown} />
                                        <div className={styles.replyText}>Hide Replies</div>
                                    </div>
                                    : comment._count.responses > 0 &&
                                    <div className={styles.replyControl} onClick={() => toggleResponses(comment.id)}>
                                        <FontAwesomeIcon className={styles.responsesIcon} icon={faAngleUp} />
                                        <div className={styles.replyText}>View Replies</div>
                                    </div>
                                }
                                {showCommentSettings[comment.id] ?
                                    <CommentSettings close={() => setShowCommentSettings({ ...showCommentSettings, [comment.id]: false })} uid={user.uid} comment={comment} toggleEdit={setEditComment} />
                                    :
                                    <FontAwesomeIcon className={styles.settingsIcon} icon={faEllipsis} onClick={() => setShowCommentSettings({ ...showCommentSettings, [comment.id]: true })} />
                                }
                            </div>

                            {openResponses[comment.id] && responses[comment.id] &&
                                <div className={styles.responses}>
                                    {responses[comment.id].map((response: CommentResponseWithStats) =>
                                    (
                                        <div className={styles.response} key={response.id}>
                                            <div className={styles.commentHeader}>
                                                <Image className={styles.responsePic} src={response.user.profilePic} width={25} height={25} alt='Profile Pic' />
                                                <div className={styles.responseName}>{response.user.displayName}</div>
                                                <div className={styles.responseTime} suppressHydrationWarning={true}>{response.createdAt !== response.updatedAt && <span className={styles.editedResponse}>Edited · </span>}{formatTimeDifference(response.createdAt)}</div>
                                                {showResponseSettings[response.id] ?
                                                    <ResponseSettings close={() => setShowResponseSettings({ ...showResponseSettings, [response.id]: false })} uid={user.uid} response={response} toggleEdit={setEditResponse} />
                                                    :
                                                    <FontAwesomeIcon className={styles.responseSettingsIcon} icon={faEllipsisVertical} onClick={() => setShowResponseSettings({ ...showResponseSettings, [response.id]: true })} />
                                                }
                                            </div>
                                            <div className={styles.commentContent}>
                                                <div className={styles.responseText}>{response.text}</div>
                                                <div className={styles.commentControls}>
                                                    <div className={styles.likeComment}>
                                                        <span className={styles.responseIconCount}>{responseNumLikes[response.id]}</span>
                                                        {likedResponses[response.id] ?
                                                            <FontAwesomeIcon className={`${styles.responseIcon} ${styles.liked}`} icon={faHeart} onClick={() => unlikeResponseHook(user.uid, response.id)} />
                                                            :
                                                            <FontAwesomeIcon className={styles.responseIcon} icon={faHeart} onClick={() => likeResponseHook(user.uid, response.id)} />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        </div>
                    ))}
                </div>
                <div className={styles.commentsFooter}>
                    {selectedComment &&
                        <>
                            <div className={styles.selectedHeader}>
                                <FontAwesomeIcon className={styles.closeIcon} icon={faCircleXmark} onClick={() => setSelectedComment(null)} />
                                Replying To
                            </div>
                            <div className={styles.selectedComment}>
                                <div className={styles.commentHeader}>
                                    <Image className={styles.profilePic} src={selectedComment.user.profilePic} width={40} height={40} alt='Profile Pic' />
                                    <div className={styles.commenterName}>{selectedComment.user.displayName}</div>
                                    <div className={styles.commentTime} suppressHydrationWarning={true}>{formatTimeDifference(selectedComment.createdAt)}</div>
                                </div>
                                <div className={styles.commentContent}>
                                    <div className={styles.commentText}>{selectedComment.text}</div>
                                </div>
                            </div>
                        </>
                    }
                    {editComment &&
                        <>
                            <div className={styles.selectedHeader}>
                                <FontAwesomeIcon className={styles.closeIcon} icon={faCircleXmark} onClick={() => setEditComment(null)} />
                                Editing Comment
                            </div>
                            <div className={styles.selectedComment}>
                                <div className={styles.commentHeader}>
                                    <Image className={styles.profilePic} src={editComment.user.profilePic} width={40} height={40} alt='Profile Pic' />
                                    <div className={styles.commenterName}>{editComment.user.displayName}</div>
                                    <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(editComment.createdAt)}</div>
                                </div>
                                <div className={styles.commentContent}>
                                    <div className={styles.commentText}>{editComment.text}</div>
                                </div>
                            </div>
                        </>
                    }
                    {editResponse &&
                        <>
                            <div className={styles.selectedHeader}>
                                <FontAwesomeIcon className={styles.closeIcon} icon={faCircleXmark} onClick={() => setEditResponse(null)} />
                                Editing Response
                            </div>
                            <div className={styles.selectedComment}>
                                <div className={styles.commentHeader}>
                                    <Image className={styles.profilePic} src={editResponse.user.profilePic} width={40} height={40} alt='Profile Pic' />
                                    <div className={styles.commenterName}>{editResponse.user.displayName}</div>
                                    <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(editResponse.createdAt)}</div>
                                </div>
                                <div className={styles.commentContent}>
                                    <div className={styles.commentText}>{editResponse.text}</div>
                                </div>
                            </div>
                        </>
                    }
                    <div className={styles.commentInput}>
                        <Image className={styles.profilePic} src={profilePic} width={50} height={50} alt='Profile Pic' />
                        <input className={styles.addComment} placeholder={selectedComment ? 'Post a response...' : 'Post a comment...'} name='input' value={input} onChange={handleInputChange} />
                        <div className={`${styles.charCount} ${charCount > maxChars && styles.overMaxChars}`}>{charCount}/{maxChars}</div>
                        <FontAwesomeIcon className={styles.sendComment} icon={faPaperPlane} onClick={!editComment && !editResponse ? handleSubmit : handleUpdateSubmit} />
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <PostCreator user={user} setModal={setIsEditModalOpen} toastTrigger={() => toast.success('Post Updated')} editMode post={post} />
                </Modal>
            )}
        </div>
    )
}

function formatTimeDifference(createdAt: Date): string {
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

function HandleCloseSettings(settingsRef: React.RefObject<HTMLElement>, setVisible: React.Dispatch<React.SetStateAction<boolean>>) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setVisible(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [settingsRef]);
}
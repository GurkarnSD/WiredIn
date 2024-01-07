import styles from '../styles/Feed/Comments.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faAngleDown, faAngleUp, faReply, faCircleXmark, faHeart, faTrash, faFlag, faPencil, faEllipsis, faXmark, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'
import ConfirmationPopup from '../ConfirmationPopup';
import { PostComment, CommentResponse, User } from '@/types';

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


export default function Comments(params: { postId: string, user: User }) {

    const { user, postId } = params;
    const [comments, setComments] = useState([]);
    const [responses, setResponses] = useState<Record<number, CommentResponseWithStats[]>>({});
    const [openResponses, setOpenResponses] = useState<Record<number, boolean>>({});
    const [selectedComment, setSelectedComment] = useState<PostCommentWithStats | null>(null);

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
        const getComments = async () => {
            setComments(await fetchComments(postId));
        };
        getComments();
    }, []);

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
            }

            setInput('');
            setCharCount(0);
            setSelectedComment(null);
            return res.json();
        } else {
            const res = await fetch('/api/feed/comments', {
                method: 'POST',
                body: JSON.stringify({
                    uid: user.uid,
                    postId: postId,
                    text: input,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to Comment');
            }

            setInput('');
            setCharCount(0);
            return res.json();
        }
    };

    const [liked, setLiked] = useState<Record<number, boolean>>({});
    const [numLikes, setNumLikes] = useState<Record<number, number>>({});

    useEffect(() => {
        const newLiked: Record<number, boolean> = {};
        const newNumLikes: Record<number, number> = {};

        comments.forEach((comment: PostCommentWithStats) => {
            newLiked[comment.id] = comment.likes.some((like: { uid: string }) => like.uid === user.uid);
            newNumLikes[comment.id] = comment._count.likes;
        });

        setLiked(newLiked);
        setNumLikes(newNumLikes);
    }, [comments]);

    const likeCommentHook = async (userId: string, commentId: number) => {
        try {
            await likeComment(userId, commentId);
            setLiked((prev) => ({
                ...prev,
                [commentId]: true,
            }));
            setNumLikes((prev) => ({
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
            setLiked((prev) => ({
                ...prev,
                [commentId]: false,
            }));
            setNumLikes((prev) => ({
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
            <div className={styles.title}>Comments</div>
            <div className={styles.commentBody}>
                {comments.map((comment: PostCommentWithStats) => (
                    <div className={styles.comment} key={comment.id}>
                        <div className={styles.commentHeader}>
                            <Image className={styles.profilePic} src={comment.user.profilePic} width={40} height={40} alt='Profile Pic' />
                            <div className={styles.commenterName}>{comment.user.displayName}</div>
                            <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(comment.createdAt)}</div>
                        </div>
                        <div className={styles.commentContent}>
                            <div className={styles.commentText}>{comment.text}</div>
                            <div className={styles.commentControls}>
                                <div className={styles.likeComment}>
                                    <span className={styles.iconCount}>{numLikes[comment.id]}</span>
                                    {liked[comment.id] ?
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
                                <CommentSettings close={() => setShowCommentSettings({ ...showCommentSettings, [comment.id]: false })} uid={user.uid} commentInfo={{ uid: comment.user.uid, commentId: comment.id }} />
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
                                            <div className={styles.responseTime} suppressHydrationWarning={true}>{formatTimeDifference(response.createdAt)}</div>
                                            {showResponseSettings[response.id] ?
                                                <ResponseSettings close={() => setShowResponseSettings({ ...showResponseSettings, [response.id]: false })} uid={user.uid} responseInfo={{ uid: response.user.uid, responseId: response.id }} />
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
                                <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(selectedComment.createdAt)}</div>
                            </div>
                            <div className={styles.commentContent}>
                                <div className={styles.commentText}>{selectedComment.text}</div>
                            </div>
                        </div>
                    </>
                }
                <div className={styles.commentInput}>
                    <Image className={styles.profilePic} src={user.profilePic} width={50} height={50} alt='Profile Pic' />
                    <input className={styles.addComment} placeholder={selectedComment ? 'Post a response...' : 'Post a comment...'} name='input' value={input} onChange={handleInputChange} />
                    <div className={`${styles.charCount} ${charCount > maxChars && styles.overMaxChars}`}>{charCount}/{maxChars}</div>
                    <FontAwesomeIcon className={styles.sendComment} icon={faPaperPlane} onClick={handleSubmit} />
                </div>
            </div>
        </div >
    )
}

const deleteComment = async (commentId: number) => {
    const res = await fetch(`/api/feed/comments?id=${commentId}`, { method: "DELETE" })

    if (!res.ok) {
        throw new Error("Failed to delete comment")
    }

    return res.json()
}

const CommentSettings = (params: { close: () => void, uid: string, commentInfo: { uid: string, commentId: number } }) => {

    const { uid, commentInfo, close } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const deleteCommentHook = async (commentId: number) => {
        try {
            await deleteComment(commentId);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.settings}>
            <FontAwesomeIcon className={styles.closeSettings} icon={faXmark} onClick={close} />
            <FontAwesomeIcon className={styles.settingsOption} icon={faFlag} />
            {commentInfo.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faPencil} />}
            {commentInfo.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faTrash} onClick={() => setConfirmationPopup(true)} />}
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => deleteCommentHook(commentInfo.commentId)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your comment'
                />
            }
        </div>
    )
}

const deleteResponse = async (responseId: number) => {
    const res = await fetch(`/api/feed/responses?id=${responseId}`, { method: "DELETE" })

    if (!res.ok) {
        throw new Error("Failed to delete post")
    }

    return res.json()
}

const ResponseSettings = (params: { close: () => void, uid: string, responseInfo: { uid: string, responseId: number } }) => {

    const { uid, responseInfo, close } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const deleteResponseHook = async (responseId: number) => {
        try {
            await deleteResponse(responseId);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.responseSettings}>
            <FontAwesomeIcon className={styles.responseCloseSettings} icon={faXmark} onClick={close} />
            <FontAwesomeIcon className={styles.responseSettingsOption} icon={faFlag} />
            {responseInfo.uid === uid && <FontAwesomeIcon className={styles.responseSettingsOption} icon={faPencil} />}
            {responseInfo.uid === uid && <FontAwesomeIcon className={styles.responseSettingsOption} icon={faTrash} onClick={() => setConfirmationPopup(true)} />}
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => deleteResponseHook(responseInfo.responseId)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your response'
                />
            }
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
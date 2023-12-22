import styles from '../styles/Feed/Comments.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane, faAngleDown, faAngleUp, faReply, faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

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

export default function Comments(params: { postId: string, user: any }) {

    type Comment = {
        id: number;
        text: string;
        createdAt: string;
        user: {
            displayName: string;
            profilePic: string;
        };
        _count: {
            responses: number;
        };
    };

    type Response = {
        id: number;
        text: string;
        createdAt: string;
        user: {
            displayName: string;
            profilePic: string;
        };
    };

    const { user, postId } = params;
    const [comments, setComments] = useState([]);
    const [responses, setResponses] = useState<Record<number, Response[]>>({});
    const [openResponses, setOpenResponses] = useState<Record<number, boolean>>({});

    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

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

    return (
        <div className={styles.container}>
            <div className={styles.title}>Comments</div>
            <div className={styles.commentBody}>
                {comments.map((comment: {
                    id: number;
                    text: string;
                    createdAt: string;
                    user: {
                        displayName: string;
                        profilePic: string;
                    };
                    _count: {
                        responses: number;
                    };
                }) => (
                    <div className={styles.comment} key={comment.id}>
                        <div className={styles.commentHeader}>
                            <Image className={styles.profilePic} src={comment.user.profilePic} width={40} height={40} alt='Profile Pic' />
                            <div className={styles.commenterName}>{comment.user.displayName}</div>
                            <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(comment.createdAt)}</div>
                        </div>
                        <div className={styles.commentContent}>
                            <div className={styles.commentText}>{comment.text}</div>
                            <FontAwesomeIcon className={styles.replyIcon} icon={faReply} onClick={() => setSelectedComment(comment)} />
                        </div>
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

                        {openResponses[comment.id] && responses[comment.id] &&
                            <div className={styles.responses}>
                                {responses[comment.id].map((response: {
                                    id: number;
                                    text: string;
                                    createdAt: string;
                                    user: {
                                        displayName: string;
                                        profilePic: string;
                                    };
                                }) => (
                                    <div className={styles.response} key={response.id}>
                                        <div className={styles.commentHeader}>
                                            <Image className={styles.responsePic} src={response.user.profilePic} width={25} height={25} alt='Profile Pic' />
                                            <div className={styles.responseName}>{response.user.displayName}</div>
                                            <div className={styles.responseTime} suppressHydrationWarning={true}>{formatTimeDifference(response.createdAt)}</div>
                                        </div>
                                        <div className={styles.responseText}>{response.text}</div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                ))}
            </div>
            <div className={styles.commentFooter}>
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
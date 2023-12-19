import styles from '../styles/Feed/Comments.module.css'
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

const fetchComments = async (uid: string) => {
    const res = await fetch(`/api/feed/comments/?uid=${uid}`)

    if (!res.ok) {
        throw new Error("Failed to fetch comments")
    }

    const comments = await res.json()

    return comments
}

export default function Comments(params: { postId: string, user: any }) {

    const { user, postId } = params;
    const [comments, setComments] = useState([]);

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
                }) => (
                    <div className={styles.comment} key={comment.id}>
                        <div className={styles.commentHeader}>
                            <Image className={styles.profilePic} src={comment.user.profilePic} width={50} height={50} alt='Profile Pic' />
                            <div className={styles.commenterName}>{comment.user.displayName}</div>
                            <div className={styles.time} suppressHydrationWarning={true}>{formatTimeDifference(comment.createdAt)}</div>
                        </div>
                        <div className={styles.commentText}>{comment.text}</div>
                    </div>
                ))}
            </div>
            <div className={styles.commentFooter}>
                <Image className={styles.profilePic} src={user.profilePic} width={50} height={50} alt='Profile Pic' />
                <input className={styles.addComment} placeholder='Post a comment...' name='input' value={input} onChange={handleInputChange} />
                <div className={`${styles.charCount} ${charCount > maxChars && styles.overMaxChars}`}>{charCount}/{maxChars}</div>
                <FontAwesomeIcon className={styles.sendComment} icon={faPaperPlane} onClick={handleSubmit} />
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
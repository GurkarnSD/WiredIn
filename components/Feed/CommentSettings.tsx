import styles from '../styles/Feed/Comments.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faXmark, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationPopup from "../ConfirmationPopup";
import { PostComment } from '@/types';

type PostCommentWithStats = PostComment & {
    likes: { uid: string }[];
    _count: {
        likes: number;
        responses: number;
    };
};

export default function CommentSettings(params: { close: () => void, uid: string, comment: PostCommentWithStats, toggleEdit: (comment: PostCommentWithStats) => void }) {

    const { uid, comment, close, toggleEdit } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const deleteComment = async (commentId: number) => {
        const res = await fetch(`/api/feed/comments?id=${commentId}`, { method: "DELETE" })

        if (!res.ok) {
            throw new Error("Failed to delete comment")
        }

        return res.json()
    }

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
            {comment.user.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faPencil} onClick={() => { toggleEdit(comment) }} />}
            {comment.user.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faTrash} onClick={() => setConfirmationPopup(true)} />}
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => deleteCommentHook(comment.id)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your comment'
                />
            }
        </div>
    )
}
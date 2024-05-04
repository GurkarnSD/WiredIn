import styles from "../styles/Feed/Post.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencil, faFlag } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import ConfirmationPopup from "../ConfirmationPopup";
import { UserPost } from "@/types";
import { Toaster, toast } from 'sonner'

export default function PostSettings(params: { uid: string, post: UserPost, selectPost?: (post: UserPost) => void, openEditModal: (isOpen: boolean) => void }) {

    const { uid, post, selectPost, openEditModal } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const deletePost = async (postId: string) => {
        const res = await fetch(`/api/feed/posts?uid=${postId}`, { method: "DELETE" })

        if (!res.ok) {
            throw new Error("Failed to Delete Post")
        }

        toast.success('Post Deleted')

        return res.json()
    }

    return (
        <div className={styles.settings}>
            <Toaster position='top-right' />
            <FontAwesomeIcon className={styles.settingsOption} icon={faFlag} />
            {post.user.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faPencil} onClick={() => { if (selectPost) selectPost(post); openEditModal(true); }} />}
            {post.user.uid === uid && <FontAwesomeIcon className={styles.settingsOption} icon={faTrash} onClick={() => setConfirmationPopup(true)} />}
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => deletePost(post.uid)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your post'
                />
            }
        </div>
    )
}
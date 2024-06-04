import styles from '../styles/Feed/Comments.module.css'
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faXmark, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmationPopup from "../ConfirmationPopup";
import { CommentResponse } from "@/types";

type CommentResponseWithStats = CommentResponse & {
    likes: { uid: string }[];
    _count: {
        likes: number;
    };
};

export default function ResponseSettings(params: { close: () => void, uid: string, response: CommentResponseWithStats, toggleEdit: (response: CommentResponseWithStats) => void, onDelete?: () => void }) {

    const { uid, response, close, toggleEdit, onDelete } = params;
    const [confirmationPopup, setConfirmationPopup] = useState(false);

    const deleteResponse = async (responseId: number) => {
        const res = await fetch(`/api/feed/responses?id=${responseId}`, { method: "DELETE" })

        if (!res.ok) {
            throw new Error("Failed to Delete Response")
        }

        onDelete && onDelete();

        return res.json()
    }

    return (
        <div className={styles.responseSettings}>
            <FontAwesomeIcon className={styles.responseCloseSettings} icon={faXmark} onClick={close} />
            <FontAwesomeIcon className={styles.responseSettingsOption} icon={faFlag} />
            {response.user.uid === uid && <FontAwesomeIcon className={styles.responseSettingsOption} icon={faPencil} onClick={() => { toggleEdit(response) }} />}
            {response.user.uid === uid && <FontAwesomeIcon className={styles.responseSettingsOption} icon={faTrash} onClick={() => setConfirmationPopup(true)} />}
            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => deleteResponse(response.id)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='delete your response'
                />
            }
        </div>
    )
}
import Modal from "./Modal"
import styles from "./styles/ConfirmationPopup.module.css"

export default function ConfirmationPopup(params: { showPopup: boolean, setShowPopup: (value: boolean) => void, message?: string, onConfirm: () => void, onCancel: () => void }) {

    const { showPopup, setShowPopup, message, onConfirm, onCancel } = params

    return (
        <Modal isOpen={showPopup} onClose={() => setShowPopup(false)}>
            <div className={styles.confirmationContainer}>
                <div className={styles.confirmationMessage}>
                    Are you sure you want to {message}?
                </div>
                <div className={styles.confirmationButtons}>
                    <button className={styles.confirmationButton} onClick={() => { onConfirm(); setShowPopup(false) }}>Yes</button>
                    <button className={styles.confirmationButton} onClick={onCancel}>No</button>
                </div>
            </div>
        </Modal>
    )
}
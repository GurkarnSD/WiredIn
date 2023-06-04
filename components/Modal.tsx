import styles from './styles/Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element {
    const handleClose = (): void => {
        onClose();
    };

    const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (event.target === event.currentTarget) {
            handleClose();
        }
    };

    return (
        <>
            {isOpen && (
                <div className={styles.overlay} onClick={handleOverlayClick}>
                    <div className={styles.dialog}>
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
}
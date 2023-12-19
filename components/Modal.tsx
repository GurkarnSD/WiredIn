import styles from './styles/Modal.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    backIcon?: boolean;
    closeIcon?: boolean;
    disableClickOff?: boolean;
}

export default function Modal({ isOpen, onClose, children, backIcon = false, closeIcon = false, disableClickOff = false }: ModalProps): JSX.Element {
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
                <div className={styles.overlay} onClick={(event) => { if (!disableClickOff) handleOverlayClick(event) }}>
                    <div className={styles.icons}>
                        {closeIcon && <FontAwesomeIcon className={styles.icon} icon={faXmark} onClick={handleClose} />}
                        {backIcon && <FontAwesomeIcon className={styles.icon} icon={faArrowLeft} onClick={handleClose} />}
                    </div>
                    <div className={styles.dialog}>
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
}
import styles from '../styles/Profile/ProfileExperienceEditor.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';

export default function ProfileExperienceEditor(params: { user: any }) {

    const { user } = params;

    const [expForm, setExpForm] = useState({
        title: '',
        company: '',
        fromDate: '',
        toDate: '',
        desc: '',
    })

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const [error, setError] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setImageFile(file);

            if (!validFileTypes.includes(file.type)) {
                setError("File must be in JPG/PNG format")
                return;
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(expForm)
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Experience</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <div className={styles.formGroupUpper}>
                        <div className={styles.formGroupLeft}>
                            <div className={styles.formGroupLeftUpper}>
                                <div className={styles.image}>
                                    <Image
                                        className={styles.experienceImage}
                                        src={image}
                                        alt=""
                                        onClick={handleImageClick}
                                        width={150}
                                        height={150}
                                    />
                                    <FontAwesomeIcon icon={faImage} className={styles.imageIcon} onClick={handleImageClick} />
                                    <input
                                        type="file"
                                        className={styles.imageInput}
                                        onChange={handleImageUpload}
                                        ref={imageInputRef}
                                        hidden
                                    />
                                </div>
                                <div className={styles.formGroupLeft2}>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>Position Title</div>
                                        <input className={styles.input} name='title' onChange={handleChange} />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>Company</div>
                                        <input className={styles.input} name='company' onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroupLeftLower}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>From</div>
                                    <input className={styles.input} name='fromDate' onChange={handleChange} />
                                </div>
                                <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} onClick={handleImageClick} />
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>To</div>
                                    <input className={styles.input} name='toDate' onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.formGroupRight}>
                            <div className={styles.inputTitle}>Description</div>
                            <textarea className={styles.desc} aria-multiline name='desc' onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className={styles.formGroupLower}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Skills</div>
                        <input className={styles.input} />
                    </div>
                </div>
                <button className={styles.saveButton} type='submit'>Save</button>
            </form>
        </div>
    )
}
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styles from '../styles/Feed/Post.module.css'

export default function PostCreator(params: { user: any }) {

    const { user } = params;

    const [input, setInput] = useState('')
    const [charCount, setCharCount] = useState(0);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const post = {
            text: input,
            image: null,
        }

        if (imageFile) {
            const postPicData = new FormData();
            postPicData.append('image', imageFile);
            postPicData.append('uid', user.uid);
            postPicData.append('type', imageFile.type);
            const postPicURL = await axios.post('/api/image', postPicData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            post['image'] = postPicURL.data.key;
        }

        const res = await fetch('/api/feed/posts', {
            method: "POST",
            body: JSON.stringify({
                post: post,
                uid: user.uid,
            })
        })

        if (!res.ok) {
            throw new Error("Failed to Post")
        }

        return res.json()

    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCharCount(event.target.value.length);
        if (charCount < 1200) {
            setInput(event.target.value);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>New Post</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <textarea className={styles.inputBox} aria-multiline name='input' placeholder='Tell everyone what they need to know...' onChange={handleInputChange} />
                <div className={styles.footer}>
                    <span>
                        <FontAwesomeIcon icon={faPaperclip} className={styles.icon} onClick={handleImageClick} />
                        <input
                            type="file"
                            className={styles.imageInput}
                            onChange={handleImageUpload}
                            ref={imageInputRef}
                            hidden
                        />
                    </span>
                    <button className={styles.postButton} type='submit'>Post</button>
                </div>
            </form>
        </div>
    )
}

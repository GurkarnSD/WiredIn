import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import styles from '../styles/Feed/Post.module.css';
import Image from 'next/image';
import Modal from '../Modal';
import { User, UserPost } from '@/types';

export default function PostCreator(params: { user: User, setModal?: (isOpen: boolean) => void, toastTrigger?: () => void, editMode?: boolean, post?: UserPost }) {
    const { user, setModal, toastTrigger, editMode, post } = params;

    const [input, setInput] = useState(editMode && post ? post.text : '');
    const [charCount, setCharCount] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxImages = 4;
    const maxChars = 1200;
    const postId = editMode && post ? post.uid : '';
    const prevImages = editMode && post ? post.images : [];

    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>(editMode && post ? post.images : []);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openImageModal = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setIsModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const removeImage = (imageUrl: string) => {
        const index = images.indexOf(imageUrl);
        if (index > -1) {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
            const newImageFiles = [...imageFiles];
            newImageFiles.splice(index, 1);
            setImageFiles(newImageFiles);
        }
        setError('');
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && images.length < maxImages) {
            const newImageFiles = Array.from(e.target.files);
            const invalidFiles = newImageFiles.filter(
                (file) => !validFileTypes.includes(file.type)
            );

            if (invalidFiles.length > 0) {
                setError('Files must be in JPG/PNG format');
                return;
            }

            if (e.target) {
                e.target.value = '';
            }

            setError('');
            setImageFiles([...imageFiles, ...newImageFiles]);
            setImages([...images, ...newImageFiles.map((file) => URL.createObjectURL(file))]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setSubmitting(true);

        interface Post {
            text: string;
            images: string[];
        }

        if (input.length == 0 && imageFiles.length == 0) {
            setError('Cannot Submit Empty Post');
            return;
        }

        if (input.length > maxChars) {
            setError('Character Limit Exceeded');
            return;
        }

        const post: Post = {
            text: input,
            images: [],
        };

        if (imageFiles.length > 0) {
            const imageUploadPromises: Promise<string>[] = imageFiles.map(async (file) => {
                const postPicData = new FormData();
                postPicData.append('image', file);
                postPicData.append('uid', user.uid);
                postPicData.append('type', file.type);

                const response = await axios.post('/api/image', postPicData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                return response.data.key;
            });

            post['images'] = await Promise.all(imageUploadPromises);
        }

        let res = null;

        if (!editMode) {
            res = await fetch('/api/feed/posts', {
                method: 'POST',
                body: JSON.stringify({
                    post: post,
                    uid: user.uid,
                }),
            });
        } else {
            const oldImages = prevImages.filter((prevImage: any) => !images.includes(prevImage));
            res = await fetch('/api/feed/posts', {
                method: 'PUT',
                body: JSON.stringify({
                    post: {
                        id: postId,
                        oldImages,
                        ...post
                    }
                }),
            });
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error('Failed to Post');
            } else {
                throw new Error('Failed to Update Post');
            }
        } else {
            setInput('');
            setCharCount(0);
            setImages([]);
            setImageFiles([]);
            if (setModal)
                setModal(false);
            if (toastTrigger)
                toastTrigger();
        }

        setSubmitting(false);

        return res.json();
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCharCount(event.target.value.length);
        setInput(event.target.value);
    };

    const calculateImageGrid = () => {
        let gridType = '';

        switch (images.length) {
            case 1:
                gridType = 'oneImage';
                break;
            case 2:
                gridType = 'twoImages';
                break;
            case 3:
                gridType = 'threeImages';
                break;
            case 4:
                gridType = 'fourImages';
                break;
        }
        return gridType;
    }

    const calculateImageClass = (index: number) => {
        if (images.length === 1) {
            return styles.largeImage;
        } else if (images.length === 2) {
            return styles.medImage;
        } else if (index === 0 && images.length === 3) {
            return styles.med1Image;
        } else if (index == 0) {
            return styles.largeImage;
        } else if (images.length === 3) {
            return styles.med2Image
        } else {
            return styles.smallImage
        }
    }

    return (
        <div className={styles.creatorContainer}>
            <div className={styles.postCreatorHeader}>
                <div className={styles.title}>{editMode ? 'Edit' : 'New'} Post</div>
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                {images.length > 0 &&
                    <div className={`${styles.imagesContainer} ${styles[calculateImageGrid()]}`}>
                        <div className={styles.imageContainer} onClick={() => openImageModal(images[0])}>
                            <Image className={`${styles.image} ${calculateImageClass(0)}`} src={images[0]} alt={''} width={0} height={0} unoptimized={editMode} />
                            <FontAwesomeIcon icon={faXmark} className={styles.removeImageIcon} onClick={(event) => { event.stopPropagation(); removeImage(images[0]); }} />
                        </div>
                        <div className={styles.imagesContainer2}>
                            {images.slice(1).map((image, index) => {
                                return (
                                    <div key={index} className={styles.imageContainer} onClick={() => openImageModal(image)}>
                                        <Image className={`${styles.image} ${calculateImageClass(index + 1)}`} src={image} alt={''} width={0} height={0} unoptimized={editMode} />
                                        <FontAwesomeIcon icon={faXmark} className={styles.removeImageIcon} onClick={(event) => { event.stopPropagation(); removeImage(image); }} />
                                    </div>
                                );
                            })}
                        </div>
                        {isModalOpen && selectedImage && (
                            <Modal isOpen={isModalOpen} onClose={closeImageModal}>
                                <div className={styles.modalImageContainer}>
                                    <Image className={styles.modalImage} src={selectedImage} alt={''} width={0} height={0} sizes="100vw" unoptimized={editMode} />
                                </div>
                            </Modal>
                        )}
                    </div>
                }
                <div className={`${styles.charCount} ${charCount > maxChars && styles.overMaxChars}`}>{charCount}/{maxChars}</div>
                <textarea className={styles.inputBox} aria-multiline name='input' value={input} placeholder='Tell everyone what they need to know...' onChange={handleInputChange} />
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
                    <button className={styles.postButton} type='submit' disabled={submitting}>{editMode ? 'Save' : 'Post'}</button>
                </div>
            </form>
        </div>
    )
}

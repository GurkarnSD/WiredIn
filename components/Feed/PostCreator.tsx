import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faXmark } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import styles from '../styles/Feed/Post.module.css';
import Image from 'next/image';
import Modal from '../Modal';

export default function PostCreator(params: { user: any }) {
    const { user } = params;

    const [input, setInput] = useState('');
    const [charCount, setCharCount] = useState(0);

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxImages = 4;

    const [error, setError] = useState('');
    const [images, setImages] = useState<string[]>([]);
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
        var index = images.indexOf(imageUrl);
        if (index > -1) {
            const newImages = [...images];
            newImages.splice(index, 1);
            setImages(newImages);
            const newImageFiles = [...imageFiles];
            newImageFiles.splice(index, 1);
            setImageFiles(newImageFiles);
        }
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

        interface Post {
            text: string;
            images: string[];
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

        const res = await fetch('/api/feed/posts', {
            method: 'POST',
            body: JSON.stringify({
                post: post,
                uid: user.uid,
            }),
        });

        if (!res.ok) {
            throw new Error('Failed to Post');
        }

        return res.json();
    };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCharCount(event.target.value.length);
        if (charCount < 1200) {
            setInput(event.target.value);
        }
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
        <div className={styles.container}>
            <div className={styles.title}>New Post</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                {images.length > 0 &&
                    <div className={`${styles.imagesContainer} ${styles[calculateImageGrid()]}`}>
                        <div className={styles.imageContainer} onClick={() => openImageModal(images[0])}>
                            <Image className={`${styles.image} ${calculateImageClass(0)}`} src={images[0]} alt={''} width={0} height={0} />
                            <FontAwesomeIcon icon={faXmark} className={styles.removeImageIcon} onClick={(event) => { event.stopPropagation(); removeImage(images[0]); }} />
                        </div>
                        <div className={styles.imagesContainer2}>
                            {images.slice(1).map((image, index) => {
                                return (
                                    <div key={index} className={styles.imageContainer} onClick={() => openImageModal(image)}>
                                        <Image className={`${styles.image} ${calculateImageClass(index + 1)}`} src={image} alt={''} width={0} height={0} />
                                        <FontAwesomeIcon icon={faXmark} className={styles.removeImageIcon} onClick={(event) => { event.stopPropagation(); removeImage(image); }} />
                                    </div>
                                );
                            })}
                        </div>
                        {isModalOpen && selectedImage && (
                            <Modal isOpen={isModalOpen} onClose={closeImageModal}>
                                <div className={styles.modalImageContainer}>
                                    <Image className={styles.modalImage} src={selectedImage} alt={''} width={0} height={0} sizes="100vw" />
                                </div>
                            </Modal>
                        )}
                    </div>
                }
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

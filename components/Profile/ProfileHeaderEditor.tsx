"use client";
import styles from '../styles/Profile/ProfileHeaderEditor.module.css'
import defaultProfile from '@/assets/defaultProfilePic.png'
import Image, { StaticImageData } from 'next/image'
import { useState, useRef } from 'react'

export default function ProfileHeaderEditor() {

    const [profileForm, setProfileForm] = useState({
        title: '',
        bio: '',
        github: '',
    })

    const [profilePic, setProfilePic] = useState<string | StaticImageData>(defaultProfile);
    const [banner, setBanner] = useState<string | StaticImageData>(defaultProfile);

    const handleProfilePicUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const uploadedImage = e.target.result.toString();
                    setProfilePic(uploadedImage);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    const uploadedImage = e.target.result.toString();
                    setBanner(uploadedImage);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleProfilePicClick = () => {
        if (profilePicInputRef.current) {
            profilePicInputRef.current.click();
        }
    };

    const handleBannerClick = () => {
        if (bannerInputRef.current) {
            bannerInputRef.current.click();
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log(profileForm)
        console.log(profilePic)
        console.log(banner)
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Profile</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.images}>
                    <div onClick={handleProfilePicClick} role="button">
                        <Image
                            className={styles.profilePic}
                            src={profilePic}
                            alt=""
                        />
                    </div>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleProfilePicUpload}
                        ref={profilePicInputRef}
                    />

                    <div onClick={handleBannerClick} role="button">
                        <Image
                            className={styles.banner}
                            src={banner}
                            alt=""
                        />
                    </div>
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleBannerUpload}
                        ref={bannerInputRef}
                    />
                </div>
                <div className={styles.inputFields}>
                    <div className={styles.inputRow}>
                        <input className={styles.input} name='title' type='text' placeholder='Title' onChange={handleChange} />
                        <input className={styles.input} name='github' type='text' placeholder='Github Username' onChange={handleChange} />
                    </div>
                    <div className={styles.inputRow}>
                        <textarea className={styles.largeInput} name='bio' placeholder='Bio' aria-multiline onChange={handleChange} />
                        <button className={styles.saveButton} type='submit'>Save</button>
                    </div>
                </div>
            </form >
        </div >
    )
}
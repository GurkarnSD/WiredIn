"use client";
import styles from '../styles/Profile/ProfileHeaderEditor.module.css'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { UserProfile } from '@/types';

export default function ProfileHeaderEditor(params: { user: UserProfile, userImages: { bannerURL: string, profileURL: string } }) {

    const { user, userImages } = params;

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const [profileForm, setProfileForm] = useState({
        title: '',
        bio: '',
        github: '',
    })

    const [error, setError] = useState('');

    const [profilePic, setProfilePic] = useState('');
    const [banner, setBanner] = useState('');

    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const profilePicInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProfilePic(userImages.profileURL);
        setBanner(userImages.bannerURL);
        setProfileForm({
            title: user.title || '',
            bio: user.bio || '',
            github: user.github || '',
        })
    }, [user])


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

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setBanner(URL.createObjectURL(file));
            setBannerFile(file);

            if (!validFileTypes.includes(file.type)) {
                setError("File must be in JPG/PNG format")
                return;
            }
        }
    };

    const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setProfilePic(URL.createObjectURL(file));
            setProfileFile(file);

            if (!validFileTypes.includes(file.type)) {
                setError("File must be in JPG/PNG format")
                return;
            }
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

        const data = {
            uid: user.uid,
            title: profileForm.title,
            bio: profileForm.bio,
            github: profileForm.github,
            profilePic: user.profilePic,
            bannerPic: user.bannerPic,
        }

        if (profileFile && profilePic !== `${process.env.S3ENDPOINT}${user.profilePic}`) {
            const profilePicData = new FormData();
            profilePicData.append('image', profileFile);
            profilePicData.append('type', profileFile.type)
            profilePicData.append('uid', user.uid);
            const profilePicURL = await axios.post('/api/image', profilePicData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            data['profilePic'] = profilePicURL.data.key;
        }

        if (bannerFile && banner !== `${process.env.S3ENDPOINT}${user.bannerPic}`) {
            const bannerPicData = new FormData();
            bannerPicData.append('image', bannerFile);
            bannerPicData.append('type', bannerFile.type);
            bannerPicData.append('uid', user.uid);
            const bannerPicURL = await axios.post('/api/image', bannerPicData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            data['bannerPic'] = bannerPicURL.data.key;
        }

        const body = JSON.stringify(data);

        await axios.put('/api/user', body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Profile</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.images}>
                    <Image
                        className={styles.profilePic}
                        src={profilePic}
                        alt=""
                        onClick={handleProfilePicClick}
                        width={150}
                        height={150}
                    />
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleProfilePicUpload}
                        ref={profilePicInputRef}
                        hidden
                    />

                    <Image
                        className={styles.banner}
                        src={banner}
                        alt=""
                        onClick={handleBannerClick}
                        width={576}
                        height={160}
                    />
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleBannerUpload}
                        ref={bannerInputRef}
                        hidden
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <div className={styles.inputFields}>
                    <div className={styles.inputRow}>
                        <input className={styles.input} name='title' type='text' placeholder='Title' value={profileForm.title} onChange={handleChange} />
                        <input className={styles.input} name='github' type='text' placeholder='Github Username' value={profileForm.github} onChange={handleChange} />
                    </div>
                    <div className={styles.inputRow}>
                        <textarea className={styles.largeInput} name='bio' placeholder='Bio' aria-multiline value={profileForm.bio} onChange={handleChange} />
                        <button className={styles.saveButton} type='submit'>Save</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
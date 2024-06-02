"use client";
import styles from '../styles/Profile/ProfileHeaderEditor.module.css'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export default function ProfileHeaderEditor(params: { user: UserProfile, userImages: { bannerURL: string, profileURL: string }, setModal?: (isOpen: boolean) => void }) {

    const { user, userImages, setModal } = params;

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const [profileForm, setProfileForm] = useState({
        title: '',
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
            title: profileForm.title,
            github: profileForm.github,
            profilePic: user.profilePic,
            bannerPic: user.bannerPic,
        }

        if (profileFile) {
            const profilePicData = new FormData();
            profilePicData.append('image', profileFile);
            profilePicData.append('type', profileFile.type);
            const profilePicURL = await fetch('/api/image', {
                method: 'POST',
                body: profilePicData,
            }).then(response => response.json());
            data['profilePic'] = profilePicURL.key;
        }

        if (bannerFile) {
            const bannerPicData = new FormData();
            bannerPicData.append('image', bannerFile);
            bannerPicData.append('type', bannerFile.type);
            const bannerPicURL = await fetch('/api/image', {
                method: 'POST',
                body: bannerPicData,
            }).then(response => response.json());
            data['bannerPic'] = bannerPicURL.key;
        }

        const body = JSON.stringify(data);

        const res = await fetch('/api/user', {
            method: 'PUT',
            body: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to Update Profile');
        } else {
            toast.success('Profile Updated Successfully');
            setModal && setModal(false);
        }
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
                        width={0}
                        height={0}
                        unoptimized
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
                        width={0}
                        height={0}
                        unoptimized
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
                        <div className={styles.inputContainer}>
                            <div className={styles.inputTitle}>Title</div>
                            <input className={styles.input} name='title' type='text' value={profileForm.title} onChange={handleChange} />
                        </div>
                        <div className={styles.inputContainer}>
                            <div className={styles.inputTitle}>Github Username</div>
                            <input className={styles.input} name='github' type='text' value={profileForm.github} onChange={handleChange} />
                        </div>
                    </div>
                    <button className={styles.saveButton} type='submit'>Save</button>
                </div>
            </form>
        </div>
    )
}
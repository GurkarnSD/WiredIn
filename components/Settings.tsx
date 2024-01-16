'use client';
import styles from './styles/Settings.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '@/types';
import { useState, useEffect } from 'react';

async function checkNameChange(username: string) {
    const res = await fetch(`/api/user/username/?username=${username}&nameChange=true`);
    const data = await res.json();
    return data;
}

async function checkUsername(username: string) {
    const res = await fetch(`/api/user/username/?username=${username}`);
    const data = await res.json();
    return data;
}

export default function Settings(params: { user: User }) {

    const { user } = params;

    const [username, setUsername] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);

    const [nameChangeAvailable, setNameChangeAvailable] = useState(null);
    const [usernameAvailable, setUsernameAvailable] = useState(null);

    useEffect(() => {
        checkNameChange(user.displayName).then((data) => {
            setNameChangeAvailable(data.available);
        });
        checkUsername(username).then((data) => {
            setUsernameAvailable(data.available);
        });
    }, [username]);

    async function saveChanges() {
        if (usernameAvailable && nameChangeAvailable) {
            await fetch('/api/user/username', {
                method: 'POST',
                body: JSON.stringify({
                    username: user.displayName,
                    newUsername: username
                })
            });
        }
    }

    return (
        <>
            <div className={styles.leftSettingsContainer}>
                <h1 className={styles.title}><FontAwesomeIcon icon={faCog} className={styles.settingsIcon} />Settings</h1>
            </div>
            <div className={styles.rightSettingsContainer}>
                <h2 className={styles.sectionTitle}>General</h2>
                <div className={styles.settings}>
                    <div className={styles.setting}>
                        <h3 className={styles.settingTitle}>Username</h3>
                        <div className={styles.usernameSection}>
                            <input className={styles.settingInput} value={username} onChange={(e) => setUsername(e.target.value)} disabled={!nameChangeAvailable} />
                            {usernameAvailable ?
                                <FontAwesomeIcon icon={faCheck} className={styles.settingsIcon} />
                                : <FontAwesomeIcon icon={faXmark} className={styles.settingsIcon} />
                            }
                        </div>
                    </div>
                    <div className={styles.setting}>
                        <h3 className={styles.settingTitle}>Email</h3>
                        <input className={styles.settingInput} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <button className={styles.button} onClick={saveChanges}>Save Changes</button>
            </div>
        </>
    )
}
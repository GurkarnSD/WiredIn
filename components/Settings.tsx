'use client';
import styles from './styles/Settings.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '@/types';
import { useState, useEffect } from 'react';
import { SettingsSession } from '@/types';
import UAParser from 'ua-parser-js';
import ConfirmationPopup from './ConfirmationPopup';

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

export default function Settings(params: { user: User, currentSession: number, sessions: SettingsSession[] }) {

    const { user, currentSession, sessions } = params;

    const [username, setUsername] = useState(user.displayName);
    const [email, setEmail] = useState(user.email);

    const [confirmationPopup, setConfirmationPopup] = useState(false);
    const [selectedSession, setSelectedSession] = useState<number>();
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

    const deleteSession = async (sessionId: number) => {
        const res = await fetch(`/api/session/remove/?id=${sessionId}`, { method: "DELETE" })

        if (!res.ok) {
            throw new Error("Failed to Delete Session")
        }

        return res.json()
    }

    function parseUserAgent(userAgent: string) {
        return /Mobile|iOS|Android/i.test(userAgent) ? 'Mobile' : 'PC';
    }

    return (
        <div className={styles.container}>
            <div className={styles.settingsHeader}>
                <h1 className={styles.title}><FontAwesomeIcon icon={faCog} className={styles.settingsIcon} />Settings</h1>
            </div>
            <div className={styles.settingsSection}>
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
            <div className={styles.settingsSessions}>
                <h2 className={styles.sectionTitle}>Sessions</h2>
                <div className={styles.sessions}>
                    {sessions.map((session) => {
                        const parser = new UAParser(session.userAgent);
                        const browser = parser.getBrowser();
                        const os = parser.getOS();
                        const device = parseUserAgent(os.name || '');

                        return (
                            <div className={`${styles.session} ${session.id === currentSession ? styles.currentSession : ''}`} key={session.id}>
                                <div className={styles.sessionInfo}>
                                    <span className={styles.infoTitle}>Browser: <span className={styles.info}>{browser.name} {browser.version}</span></span>
                                    <span className={styles.infoTitle}>Operating System: <span className={styles.info}>{os.name} {os.version}</span></span>
                                    <span className={styles.infoTitle}>Device: <span className={styles.info}>{device}</span></span>
                                    <span className={styles.infoTitle}>IP Address: <span className={styles.info}>{session.ipAddress}</span></span>
                                    <span className={styles.infoTitle}>Location: <span className={styles.info}>{session.location}</span></span>
                                </div>
                                <FontAwesomeIcon icon={faXmark} className={styles.removeIcon} onClick={() => { setSelectedSession(session.id); setConfirmationPopup(true); }} />
                            </div>
                        )
                    })}
                </div>
            </div>

            {confirmationPopup &&
                <ConfirmationPopup
                    showPopup={confirmationPopup}
                    setShowPopup={setConfirmationPopup}
                    onConfirm={() => selectedSession && deleteSession(selectedSession)}
                    onCancel={() => setConfirmationPopup(false)}
                    message='remove this session'
                />
            }
        </div>
    )
}
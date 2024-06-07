'use client';
import styles from './styles/Settings.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from '@/types';
import { useState, useEffect } from 'react';
import { SettingsSession } from '@/types';
import UAParser from 'ua-parser-js';
import ConfirmationPopup from './ConfirmationPopup';
import { toast } from 'sonner';

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
    const [error, setError] = useState('');

    const [confirmationPopup, setConfirmationPopup] = useState(false);
    const [selectedSession, setSelectedSession] = useState<number>();
    const [nameChangeAvailable, setNameChangeAvailable] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        setIsSearching(true);

        setDebounceTimeout(
            setTimeout(() => {
                if (username.length > 20) {
                    setError('Username must be less than 20 characters');
                    setUsernameAvailable(false);
                } else {
                    setError('');
                    checkNameChange(user.displayName).then((data) => {
                        setNameChangeAvailable(data.available);
                    });
                    checkUsername(username).then((data) => {
                        setUsernameAvailable(data.available);
                    });
                }
                setIsSearching(false);
            }, 1000)
        );
    }, [username]);

    async function saveChanges() {
        if (usernameAvailable && nameChangeAvailable) {
            const res = await fetch('/api/user/username', {
                method: 'POST',
                body: JSON.stringify({
                    username: user.displayName,
                    newUsername: username
                })
            });

            if (!res.ok) {
                toast.error('Failed to change username');
                return;
            }

            toast.success('Username changed');
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
                <div className={styles.sectionHeader}>
                    <h2>General</h2>
                    {error && <div className={styles.error}>{error}</div>}
                </div>
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
                        <div className={styles.disclaimer}>*Username can only be changed every 30 days</div>
                    </div>
                    <div className={styles.setting}>
                        <h3 className={styles.settingTitle}>Email</h3>
                        <input className={styles.settingInput} value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                    </div>
                </div>
                <button className={styles.button} onClick={saveChanges} disabled={isSearching || !nameChangeAvailable || !usernameAvailable}>Save Changes</button>
            </div>
            <div className={styles.settingsSessions}>
                <div className={styles.sectionHeader}>
                    <h2>Sessions</h2>
                </div>
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
"use client";
import styles from '../styles/Profile/ProfileSkillsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from '../Modal';
import { UserSkill } from '@/types';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function ProfileSkillsEditor(params: { skills: UserSkill[], toastTrigger?: () => void, onSuccess?: () => void }) {

    const { skills, toastTrigger, onSuccess } = params;
    const { data: skillOptions } = useSWR('/api/profile/skills', fetcher)

    const currentSkills = skills.map((skill: UserSkill) => skill.name);

    const [addSkillOpen, setAddSkillOpen] = useState(false);

    const handleAddSkill = () => {
        setAddSkillOpen(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>Skills</div>
                <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={handleAddSkill} />
            </div>

            <div className={styles.body}>
                {skills?.map((skill: UserSkill) => (
                    <div key={skill.id} className={styles.skill}>{skill.name}</div>
                ))}
            </div>

            {addSkillOpen && (
                <Modal isOpen={addSkillOpen} onClose={() => setAddSkillOpen(false)}>
                    <AddSkillMenu controlModal={setAddSkillOpen} skills={currentSkills} skillOptions={skillOptions} toastTrigger={toastTrigger} onSuccess={onSuccess} />
                </Modal>
            )}
        </div>
    )
}

export function AddSkillMenu(params: { controlModal: (toggle: boolean) => void, skills: string[], skillOptions: { skill: string }[], editMode?: boolean, skill?: UserSkill, toastTrigger?: () => void, onSuccess?: () => void }) {

    const { controlModal, skills, skillOptions, editMode, skill, toastTrigger, onSuccess } = params;

    const skillsList = skillOptions.map((skill: { skill: string }) => skill.skill).filter((skill: string) => !skills.includes(skill));

    const [inputValue, setInputValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState(editMode && skill ? skill.name : '');
    const [learnedIn, setLearnedIn] = useState<number>(editMode && skill ? skill.learnedIn : Number(new Date().getFullYear().toString()));
    const [submitting, setSubmitting] = useState(false);

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleLearnedInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value, 10);
        setLearnedIn(newValue);
    };

    const handleSkillSelection = (skill: string) => {
        setSelectedSkill(skill);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitting(true);

        const skillData = {
            id: editMode && skill ? skill.id : undefined,
            name: selectedSkill,
            learnedIn: learnedIn,
        };

        let res = null;

        if (!editMode) {
            res = await fetch('/api/profile/skills/user', {
                method: "POST",
                body: JSON.stringify({
                    skill: skillData,
                })
            })
        } else {
            res = await fetch('/api/profile/skills/user', {
                method: "PUT",
                body: JSON.stringify({
                    skill: skillData,
                })
            })
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error("Failed to Add Skill")
            } else {
                throw new Error("Failed to Update Skill")
            }
        }

        toastTrigger && toastTrigger();
        onSuccess && onSuccess();
        controlModal(false);
        setSubmitting(false);
        return res.json()
    }

    return (
        <form className={styles.addSkillMenu} onSubmit={handleSubmit}>
            <div className={styles.title}>{!editMode ? "Add" : "Edit"} A Skill</div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Search Skills"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className={styles.selectionBox}>
                    {filteredSkills.map((skill, index) => (
                        <label key={index} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                value={skill}
                                checked={selectedSkill === skill}
                                disabled={editMode && skill ? true : false}
                                onChange={() => handleSkillSelection(skill)}
                                className={styles.customCheckbox}
                            />
                            <span className={styles.checkboxCustom}></span>
                            &nbsp;{skill}
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.skillFooter}>
                <span className={styles.text}>Learned In&nbsp;
                    <input className={styles.smallInput} type='number' min='1920' max={new Date().getFullYear().toString()}
                        value={learnedIn !== undefined ? learnedIn.toString() : ''}
                        onChange={handleLearnedInChange} />
                </span>
                <button className={styles.addButton} type='submit' disabled={submitting}>{!editMode ? "Add" : "Save"}</button>
            </div>
        </form>
    )
}
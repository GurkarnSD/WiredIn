"use client";
import styles from '../styles/Profile/ProfileSkillsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from '../Modal';
import { UserSkill } from '@/types';

export default function ProfileSkillsEditor(params: { skills: UserSkill[], skillOptions: { skill: string }[] }) {

    const { skills, skillOptions } = params;

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
                    <div className={styles.skill} key={skill.id}>
                        <div className={styles.skillName}>{skill.name}</div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={styles.saveButton} type='submit'>Save</button>
            </div>

            {addSkillOpen && (
                <Modal isOpen={addSkillOpen} onClose={() => setAddSkillOpen(false)}>
                    <AddSkillMenu controlModal={setAddSkillOpen} skills={currentSkills} skillOptions={skillOptions} />
                </Modal>
            )}
        </div>
    )
}

function AddSkillMenu(params: { controlModal: (toggle: boolean) => void, skills: string[], skillOptions: { skill: string }[] }) {

    const { controlModal, skills, skillOptions } = params;

    const skillsList = skillOptions.map((skill: { skill: string }) => skill.skill).filter((skill: string) => !skills.includes(skill));

    const [inputValue, setInputValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [learnedIn, setLearnedIn] = useState<number>();
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

        const skill = {
            name: selectedSkill,
            learnedIn: learnedIn,
        };

        const res = await fetch('/api/profile/skills/user', {
            method: "POST",
            body: JSON.stringify({
                skill: skill,
            })
        })

        if (!res.ok) {
            throw new Error("Failed to Add Skill")
        }


        controlModal(false);
        setSubmitting(false);
        return res.json()
    }

    return (
        <form className={styles.addSkillMenu} onSubmit={handleSubmit}>
            <div className={styles.title}>Add A Skill</div>
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
                    <input className={styles.smallInput} type='number' min='1920' max='2120'
                        value={learnedIn !== undefined ? learnedIn.toString() : ''}
                        onChange={handleLearnedInChange} />
                </span>
                <button className={styles.addButton} type='submit' disabled={submitting}>Add</button>
            </div>
        </form>
    )
}
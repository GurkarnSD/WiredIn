"use client";
import styles from '../styles/Profile/ProfileSkillsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from '../Modal';

export default function ProfileSkillsEditor(params: { user: any, skills: any }) {

    const { user, skills } = params;

    const currentSkills = skills.map((skill: any) => skill.name);

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
                {skills?.map((skill: any) => (
                    <div className={styles.skill} key={skill.skill}>
                        <div className={styles.skillName}>{skill.name}</div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <button className={styles.saveButton} type='submit'>Save</button>
            </div>

            {addSkillOpen && (
                <Modal isOpen={addSkillOpen} onClose={() => setAddSkillOpen(false)}>
                    <AddSkillMenu uid={user.uid} controlModal={setAddSkillOpen} skills={currentSkills} />
                </Modal>
            )}
        </div>
    )
}

function AddSkillMenu(params: { uid: string, controlModal: (toggle: boolean) => void, skills: any }) {

    const { uid, controlModal, skills } = params;

    const skillsList = [
        'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'Django', 'Flask', 'Ruby on Rails',
        'GraphQL', 'REST API', 'SQL', 'NoSQL', 'MongoDB', 'Firebase', 'PostgreSQL', 'MySQL',
        'HTML5', 'CSS3', 'Sass', 'Less', 'Webpack', 'Babel', 'Jest', 'Testing Library',
        'Redux', 'Mobx', 'State Management', 'Responsive Design', 'UI/UX Design',
        'Git', 'GitHub', 'CI/CD', 'Docker', 'Kubernetes',
        'AWS', 'Azure', 'Google Cloud', 'Serverless', 'Microservices',
        'OAuth', 'Web Security', 'PWA', 'Web Accessibility',
        'Machine Learning', 'TensorFlow', 'PyTorch', 'NLP',
        'Blockchain', 'Solidity', 'Cybersecurity',
    ].filter(skill => !skills.includes(skill));

    const [inputValue, setInputValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [learnedIn, setLearnedIn] = useState<Number>();

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

        const skill = {
            name: selectedSkill,
            learnedIn: learnedIn,
        };

        const res = await fetch('/api/profile/skills', {
            method: "POST",
            body: JSON.stringify({
                skill: skill,
                user: uid
            })
        })

        if (!res.ok) {
            throw new Error("Failed to Add Skill")
        }

        controlModal(false);
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
                <button className={styles.addButton} type='submit'>Add</button>
            </div>
        </form>
    )
}
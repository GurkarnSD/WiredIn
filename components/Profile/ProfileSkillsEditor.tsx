"use client";
import styles from '../styles/Profile/ProfileSkillsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Modal from '../Modal';
import axios from 'axios';

export default function ProfileSkillsEditor(params: { user: any }) {

    const { user } = params;

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
            <div className={styles.footer}>
                <button className={styles.saveButton} type='submit'>Save</button>
            </div>

            {addSkillOpen && (
                <Modal isOpen={addSkillOpen} onClose={() => setAddSkillOpen(false)}>
                    <AddSkillMenu />
                </Modal>
            )}
        </div>
    )
}

function AddSkillMenu() {

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
    ];

    const [inputValue, setInputValue] = useState('');
    const [selectedSkill, setSelectedSkill] = useState('');
    const [learnedIn, setLearnedIn] = useState('');

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleLearnedInChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLearnedIn(event.target.value);
    };

    const handleSkillSelection = (skill: string) => {
        setSelectedSkill(skill);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(selectedSkill, learnedIn);
    }

    return (
        <form className={styles.addSkillMenu} onSubmit={handleSubmit}>
            <div className={styles.title}>Add A Skill</div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Enter A Skill"
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
                    <input className={styles.smallInput} type='text'
                        value={learnedIn} onChange={handleLearnedInChange} />
                </span>
                <button className={styles.addButton} type='submit'>Add</button>
            </div>
        </form>
    )
}
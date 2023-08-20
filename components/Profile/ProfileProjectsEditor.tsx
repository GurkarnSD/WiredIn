import styles from '../styles/Profile/ProfileProjectsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function ProfileProjectsEditor(params: { user: any }) {

    const { user } = params;

    const [projForm, setProjForm] = useState({
        title: '',
        deployment: '',
        fromDate: '',
        toDate: '',
        developing: false,
        source: '',
        desc: '',
    })
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [error, setError] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProjForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(projForm)
        console.log(selectedSkills)
    }

    const skills = [
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

    const handleSkillSelection = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
            return;
        }
        setSelectedSkills([...selectedSkills, skill]);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Projects</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <div className={styles.formGroupUpper}>
                        <div className={styles.formGroupLeft}>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Project Title</div>
                                <input className={styles.input} name='title' onChange={handleChange} />
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Deployment Link</div>
                                <input className={styles.input} name='deployment' onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formGroupRight}>
                            <div className={styles.dateContainer}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>From</div>
                                    <input className={styles.input} name='fromDate' onChange={handleChange} />
                                </div>
                                <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} />
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>To</div>
                                    <input className={styles.input} name='toDate' onChange={handleChange} />
                                </div>
                                <div className={styles.checkboxContainer}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type='checkbox'
                                            className={styles.customCheckbox}
                                            value={projForm.developing === true ? 'true' : 'false'}
                                            checked={projForm.developing}
                                            onClick={() => {
                                                setProjForm((prev) => ({
                                                    ...prev,
                                                    developing: !prev.developing,
                                                }))
                                            }}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        <div className={styles.inputTitle}>Current</div>
                                    </label>
                                </div>
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Source Code Link</div>
                                <input className={styles.input} name='source' onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroupLower}>
                        <div className={styles.largeFormGroupLeft}>
                            <div className={styles.inputTitle}>Description</div>
                            <textarea className={styles.desc} aria-multiline name='desc' onChange={handleChange} />
                        </div>
                        <div className={styles.smallFormGroupRight}>
                            <div className={styles.inputTitle}>Skills</div>
                            <div className={styles.selectionBox}>
                                {skills.map((skill, index) => (
                                    <label key={index} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            value={skill}
                                            checked={selectedSkills.includes(skill)}
                                            onChange={() => handleSkillSelection(skill)}
                                            className={styles.customCheckbox}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        &nbsp;{skill}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <button className={styles.saveButton} type='submit'>Save</button>
            </form >
        </div >
    )
}
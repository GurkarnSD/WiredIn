import styles from '../styles/Profile/ProfileExperienceEditor.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faArrowsLeftRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import Modal from '../Modal';

export default function ProfileExperienceEditor(params: { user: any }) {

    const { user } = params;

    const [expForm, setExpForm] = useState({
        title: '',
        company: '',
        fromDate: '',
        toDate: '',
        desc: '',
        current: false,
    })

    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const [error, setError] = useState('');
    const [image, setImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (imageInputRef.current) {
            imageInputRef.current.click();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setImage(URL.createObjectURL(file));
            setImageFile(file);

            if (!validFileTypes.includes(file.type)) {
                setError("File must be in JPG/PNG format")
                return;
            }
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExpForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const [selectSkillsOpen, setSelectSkillsOpen] = useState(false);

    const handleAddSkill = () => {
        setSelectSkillsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(expForm)
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>Experience</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <div className={styles.formGroupUpper}>
                        <div className={styles.formGroupLeft}>
                            <div className={styles.formGroupLeftUpper}>
                                <div className={styles.image}>
                                    {image ?
                                        <Image
                                            className={styles.experienceImage}
                                            src={image}
                                            alt=""
                                            onClick={handleImageClick}
                                            width={150}
                                            height={150}
                                        /> :
                                        <>
                                            <div className={styles.experienceImage} />
                                            <FontAwesomeIcon icon={faImage} className={styles.imageIcon} onClick={handleImageClick} />
                                        </>
                                    }
                                    <input
                                        type="file"
                                        className={styles.imageInput}
                                        onChange={handleImageUpload}
                                        ref={imageInputRef}
                                        hidden
                                    />
                                </div>
                                <div className={styles.formGroupLeft2}>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>Position Title</div>
                                        <input className={styles.input} name='title' onChange={handleChange} />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>Company</div>
                                        <input className={styles.input} name='company' onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroupLeftLower}>
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
                                    <label className={styles.smallCheckboxLabel}>
                                        <input
                                            type='checkbox'
                                            className={styles.smallCustomCheckbox}
                                            value={expForm.current === true ? 'true' : 'false'}
                                            checked={expForm.current}
                                            onClick={() => {
                                                setExpForm((prev) => ({
                                                    ...prev,
                                                    current: !prev.current,
                                                }))
                                            }}
                                        />
                                        <span className={styles.smallCheckboxCustom}></span>
                                        <div className={styles.inputTitle}>Current</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.formGroupRight}>
                            <div className={styles.inputTitle}>Description</div>
                            <textarea className={styles.desc} aria-multiline name='desc' onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className={styles.formGroupLower}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Skills</div>
                        <div className={styles.skillsInput} >
                            <FontAwesomeIcon icon={faPlus} className={styles.icon} onClick={handleAddSkill} />
                        </div>
                    </div>
                </div>
                <button className={styles.saveButton} type='submit'>Save</button>
            </form>

            {selectSkillsOpen && (
                <Modal isOpen={selectSkillsOpen} onClose={() => setSelectSkillsOpen(false)}>
                    <SelectSkills />
                </Modal>
            )}
        </div>
    )
}

function SelectSkills() {

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
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const filteredSkills = skillsList.filter(skill =>
        skill.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleSkillSelection = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            setSelectedSkills(selectedSkills.filter((s) => s !== skill));
            return;
        }
        setSelectedSkills([...selectedSkills, skill]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(selectedSkills);
    }

    return (
        <form className={styles.selectSkillsMenu} onSubmit={handleSubmit}>
            <div className={styles.title}>Select Skills</div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.largeInput}
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
            <div className={styles.skillFooter}>
                <button className={styles.selectButton} type='submit'>Add</button>
            </div>
        </form>
    )
}
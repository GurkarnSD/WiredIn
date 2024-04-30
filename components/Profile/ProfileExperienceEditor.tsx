import styles from '../styles/Profile/ProfileExperienceEditor.module.css'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faArrowsLeftRight, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import Modal from '../Modal';
import axios from 'axios';
import { UserSkill, WorkExperience } from '@/types';

export default function ProfileExperienceEditor(params: { skills: UserSkill[], setModal?: (isOpen: boolean) => void, editMode?: boolean, experience?: WorkExperience }) {

    const { skills, setModal, editMode, experience } = params;

    const currentSkills = skills.map((skill: UserSkill) => skill.name);

    const [expForm, setExpForm] = useState({
        id: editMode && experience ? experience.id : null,
        prevSkills: editMode && experience ? experience.skills?.map((skill) => skill.id) ?? [] : [],
        title: editMode && experience ? experience.title : '',
        company: editMode && experience ? experience.company : '',
        start: editMode && experience ? new Date(experience.start).toISOString().slice(0, 7) : '',
        end: editMode && experience && experience.end !== null ? new Date(experience.end).toISOString().slice(0, 7) : '',
        desc: editMode && experience ? experience.description : '',
        current: editMode && experience ? experience.current : false,
    })

    const [selectedSkills, setSelectedSkills] = useState<string[]>(editMode && experience ? experience.skills?.map((skill) => skill.name) ?? [] : []);
    const [submitting, setSubmitting] = useState(false);
    const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    const [error, setError] = useState('');
    const [image, setImage] = useState(editMode && experience ? experience.image : '');
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

        setSubmitting(true);

        const skillIds = selectedSkills.map((skill: string) => {
            const foundSkill = skills.find((s: UserSkill) => s.name === skill);
            if (foundSkill) {
                return { id: foundSkill.id };
            }
        });

        const experience = {
            title: expForm.title,
            company: expForm.company,
            start: expForm.start + '-01T00:00:00.000Z',
            end: expForm.end !== '' ? expForm.end + '-01T00:00:00.000Z' : null,
            current: expForm.current,
            description: expForm.desc,
            skills: skillIds,
            image: null,
        }

        if (imageFile) {
            const experiencePicData = new FormData();
            experiencePicData.append('image', imageFile);
            experiencePicData.append('type', imageFile.type)
            const experiencePicURL = await axios.post('/api/image', experiencePicData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            experience['image'] = experiencePicURL.data.key;
        }

        let res = null;

        if (!editMode) {
            res = await fetch('/api/profile/experiences', {
                method: "POST",
                body: JSON.stringify({
                    experience: experience,
                })
            })
        } else {
            res = await fetch('/api/profile/experiences', {
                method: "PUT",
                body: JSON.stringify({
                    experience: {
                        id: expForm.id,
                        prevSkills: expForm.prevSkills.map((prevSkill: any) => { if (!skillIds.includes({ id: prevSkill })) { return { id: prevSkill } } }),
                        ...experience
                    },
                })
            })
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error("Failed to Add Experience")
            } else {
                throw new Error("Failed to Edit Experience")
            }
        } else {
            setExpForm({
                id: null,
                prevSkills: [],
                title: '',
                company: '',
                start: '',
                end: '',
                desc: '',
                current: false,
            })
            setSelectedSkills([]);
            setImage('');
            setImageFile(null);
            if (setModal) {
                setModal(false);
            }
        }

        setSubmitting(false);

        return res.json()
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>{editMode && "Edit "}Experience</div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <div className={styles.formGroupUpper}>
                        <div className={styles.formGroupLeft}>
                            <div className={styles.formGroupLeftUpper}>
                                <div className={styles.image}>
                                    {image ?
                                        <>
                                            <Image
                                                className={styles.experienceImage}
                                                src={image}
                                                alt=""
                                                onClick={handleImageClick}
                                                width={150}
                                                height={150}
                                            />
                                            {editMode && <FontAwesomeIcon icon={faXmark} className={styles.deleteImageIcon}
                                                onClick={() => {
                                                    setImage('');
                                                    setImageFile(null);
                                                }} />}
                                        </> :
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
                                        <input className={styles.input} name='title' value={expForm.title} onChange={handleChange} />
                                    </div>
                                    <div className={styles.inputContainer}>
                                        <div className={styles.inputTitle}>Company</div>
                                        <input className={styles.input} name='company' value={expForm.company} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroupLeftLower}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>From</div>
                                    <input className={styles.input} type='month' name='start' value={expForm.start} onChange={handleChange} />
                                </div>
                                <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} />
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>To</div>
                                    <input className={styles.input} type='month' name='end' value={expForm.end} onChange={handleChange} />
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
                            <textarea className={styles.desc} aria-multiline name='desc' value={expForm.desc} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                <div className={styles.formGroupLower}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Skills</div>
                        <div className={styles.skillsInput}>
                            <div className={styles.skills}>
                                {selectedSkills.map((skill: string, index: number) => (
                                    <div key={index} className={styles.skill}>
                                        {skill}{index !== selectedSkills.length - 1 && ','}&nbsp;
                                    </div>
                                ))}
                            </div>
                            <FontAwesomeIcon icon={faPlus} className={styles.addSkillIcon} onClick={handleAddSkill} />
                        </div>
                    </div>
                </div>
                <button className={styles.saveButton} type='submit' disabled={submitting}>Save</button>
            </form>

            {selectSkillsOpen && (
                <Modal isOpen={selectSkillsOpen} onClose={() => setSelectSkillsOpen(false)}>
                    <SelectSkills skillsList={currentSkills} selector={setSelectedSkills} chosenSkills={selectedSkills} />
                </Modal>
            )}
        </div>
    )
}

function SelectSkills(params: { skillsList: string[], selector: (skills: string[]) => void, chosenSkills: string[] }) {

    const { skillsList, selector, chosenSkills } = params;

    const [inputValue, setInputValue] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(chosenSkills);

    const filteredSkills = skillsList.filter((skill: string) =>
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
        selector(selectedSkills);
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
                    {filteredSkills.map((skill: string, index: number) => (
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
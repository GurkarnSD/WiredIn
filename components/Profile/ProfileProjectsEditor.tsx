import styles from '../styles/Profile/ProfileProjectsEditor.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { UserProfile, UserProject, UserSkill } from '@/types';

export default function ProfileProjectsEditor(params: { user: UserProfile, skills: UserSkill[], setModal?: (isOpen: boolean) => void, editMode?: boolean, project?: UserProject }) {

    const { user, skills, setModal, editMode, project } = params;

    const currentSkills = skills.map((skill: UserSkill) => skill.name);

    const [projForm, setProjForm] = useState({
        id: editMode && project ? project.id : null,
        prevSkills: editMode && project ? project.skills?.map((skill) => skill.id) ?? [] : [],
        title: editMode && project ? project.title : '',
        deployment: editMode && project ? project.deployment : '',
        start: editMode && project ? new Date(project.start).toISOString().slice(0, 7) : '',
        end: editMode && project ? new Date(project.end).toISOString().slice(0, 7) : '',
        current: editMode && project ? project.current : false,
        source: editMode && project ? project.source : '',
        desc: editMode && project ? project.description : '',
    })
    const [selectedSkills, setSelectedSkills] = useState<string[]>(editMode && project ? project.skills?.map((skill) => skill.name) ?? [] : []);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProjForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setSubmitting(true);

        const skillIds = selectedSkills.map((skill: string) => {
            const foundSkill = skills.find((s: UserSkill) => s.name === skill);
            if (foundSkill) {
                return { id: foundSkill.id };
            }
        });

        const project = {
            title: projForm.title,
            description: projForm.desc,
            deployment: projForm.deployment,
            start: projForm.start + '-01T00:00:00.000Z',
            end: projForm.end + '-01T00:00:00.000Z',
            current: projForm.current,
            source: projForm.source,
            skills: skillIds,
        }

        let res = null;

        if (!editMode) {
            res = await fetch('/api/profile/projects', {
                method: 'POST',
                body: JSON.stringify({
                    project: project,
                    uid: user.uid
                })
            })
        } else {
            res = await fetch('/api/profile/projects', {
                method: 'PUT',
                body: JSON.stringify({
                    project: {
                        id: projForm.id,
                        prevSkills: projForm.prevSkills.map((prevSkill: any) => { if (!skillIds.includes({ id: prevSkill })) { return { id: prevSkill } } }),
                        ...project
                    },
                })
            })
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error("Failed to Add Project")
            } else {
                throw new Error("Failed to Update Project")
            }
        } else {
            setProjForm({
                id: null,
                prevSkills: [],
                title: '',
                deployment: '',
                start: '',
                end: '',
                current: false,
                source: '',
                desc: '',
            })
            setSelectedSkills([]);
            if (setModal)
                setModal(false);
        }

        setSubmitting(false);

        return res.json()
    }

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
                                <input className={styles.input} name='title' value={projForm.title} onChange={handleChange} />
                            </div>
                            <div className={styles.inputContainer}>
                                <div className={styles.inputTitle}>Deployment Link</div>
                                <input className={styles.input} name='deployment' value={projForm.deployment} onChange={handleChange} />
                            </div>
                            <div className={`${styles.inputContainer} ${styles.sourceCodeLeft}`}>
                                <div className={styles.inputTitle}>Source Code Link</div>
                                <input className={styles.input} name='source' onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.formGroupRight}>
                            <div className={styles.dateContainer}>
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>From</div>
                                    <input className={styles.input} type='month' name='start' value={projForm.start} onChange={handleChange} />
                                </div>
                                <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} />
                                <div className={styles.inputContainer}>
                                    <div className={styles.inputTitle}>To</div>
                                    <input className={styles.input} type='month' name='end' value={projForm.end} onChange={handleChange} />
                                </div>
                                <div className={styles.checkboxContainer}>
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type='checkbox'
                                            className={styles.customCheckbox}
                                            value={projForm.current === true ? 'true' : 'false'}
                                            checked={projForm.current}
                                            onClick={() => {
                                                setProjForm((prev) => ({
                                                    ...prev,
                                                    current: !prev.current,
                                                }))
                                            }}
                                        />
                                        <span className={styles.checkboxCustom}></span>
                                        <div className={styles.inputTitle}>Current</div>
                                    </label>
                                </div>
                            </div>
                            <div className={`${styles.inputContainer} ${styles.sourceCodeRight}`}>
                                <div className={styles.inputTitle}>Source Code Link</div>
                                <input className={styles.input} name='source' value={projForm.source} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroupLower}>
                        <div className={styles.largeFormGroupLeft}>
                            <div className={styles.inputTitle}>Description</div>
                            <textarea className={styles.desc} aria-multiline name='desc' value={projForm.desc} onChange={handleChange} />
                        </div>
                        <div className={styles.smallFormGroupRight}>
                            <div className={styles.inputTitle}>Skills</div>
                            <div className={styles.selectionBox}>
                                {currentSkills.map((skill: string, index: number) => (
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
                <button className={styles.saveButton} type='submit' disabled={submitting}>Save</button>
            </form >
        </div >
    )
}
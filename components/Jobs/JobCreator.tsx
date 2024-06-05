import styles from '../styles/Jobs/Jobs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import SelectOptions from '../SelectOptions';
import Modal from '../Modal';
import { UserJob } from '@/types';

export default function JobCreator(params: { skillOptions: { skill: string }[], tagOptions: { tag: string }[], setModal?: (isOpen: boolean) => void, toastTrigger?: () => void, editMode?: boolean, job?: UserJob, onSuccess?: () => void }) {

    const { skillOptions, tagOptions, setModal, toastTrigger, editMode, job, onSuccess } = params;

    const [jobForm, setJobForm] = useState({
        title: editMode && job ? job.title : '',
        location: editMode && job ? job.location : '',
        desc: editMode && job ? job.description : '',
        salary: editMode && job?.salary ? job.salary.toString() : '',
        hourly: editMode && job?.hourly ? job.hourly.toString() : '',
        start: editMode && job?.start ? new Date(job.start).toISOString().slice(0, 7) : '',
        end: editMode && job?.end ? new Date(job.end).toISOString().slice(0, 7) : ''
    })
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const jobId = editMode && job ? job.uid : '';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const [selectedSkills, setSelectedSkills] = useState<string[]>(editMode && job ? job.skills.map((skill) => { return skill.skill }) : []);
    const [selectSkillsOpen, setSelectSkillsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>(editMode && job ? job.tags.map((tag) => { return tag.tag }) : []);
    const [selectTagsOpen, setSelectTagsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');
        setSubmitting(true);

        const { title, location, desc, salary, hourly, start, end } = jobForm;

        const job = {
            title,
            location,
            description: desc,
            skills: selectedSkills,
            tags: selectedTags,
            salary: parseInt(salary),
            hourly: parseFloat(hourly),
            start: start ? start + '-01T00:00:00.000Z' : null,
            end: end ? end + '-01T00:00:00.000Z' : null,
        }

        if (!title) {
            setError('Title is required');
            setSubmitting(false);
            return;
        }

        if (!location) {
            setError('Location is required');
            setSubmitting(false);
            return;
        }

        if (!desc) {
            setError('Description is required');
            setSubmitting(false);
            return;
        }

        if (job.start && job.end && job.start > job.end) {
            setError('Start date must be before end date');
            setSubmitting(false);
            return;
        }

        let res = null;

        if (!editMode) {
            res = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ job })
            })
        } else {
            res = await fetch(`/api/jobs`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ job: { id: jobId, ...job } })
            })
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error('Failed to Publish Job');
            } else {
                throw new Error('Failed to Update Job');
            }
        } else {
            setJobForm({
                title: '',
                location: '',
                desc: '',
                salary: '',
                hourly: '',
                start: '',
                end: ''
            });
            setSelectedSkills([]);
            setSelectedTags([]);
            setModal && setModal(false);
            toastTrigger && toastTrigger();
            onSuccess && onSuccess();
        }

        setSubmitting(false);

        return res.json();
    }

    return (
        <div className={styles.jobCreator}>
            <div className={styles.jobCreatorHeader}>
                <h1 className={styles.title2}>Job {editMode ? 'Editor' : 'Creator'}</h1>
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <form className={styles.jobForm} onSubmit={handleSubmit}>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Position Title</div>
                        <input className={styles.input} name='title' value={jobForm.title} onChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Location</div>
                        <input className={styles.input} name='location' value={jobForm.location} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputHeader}>
                            <div className={styles.inputTitle}>Skills</div>
                            <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={() => setSelectSkillsOpen(true)} />
                        </div>
                        <div className={styles.selectionInput}>
                            {selectedSkills.join(', ')}
                        </div>
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputHeader}>
                            <div className={styles.inputTitle}>Tags</div>
                            <FontAwesomeIcon className={styles.icon} icon={faPlus} onClick={() => setSelectTagsOpen(true)} />
                        </div>
                        <div className={styles.selectionInput}>
                            {selectedTags.join(', ')}
                        </div>
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Hourly Rate</div>
                        <input className={styles.input} type='number' step='0.01' name='hourly' value={jobForm.hourly} onChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Salary</div>
                        <input className={styles.input} type='number' name='salary' value={jobForm.salary} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>From</div>
                        <input className={styles.input} type='month' name='start' value={jobForm.start} onChange={handleChange} />
                    </div>
                    <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} />
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>To</div>
                        <input className={styles.input} type='month' name='end' value={jobForm.end} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.largeInputContainer}>
                        <div className={styles.inputTitle}>Description</div>
                        <textarea className={styles.desc} aria-multiline name='desc' value={jobForm.desc} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormFooter}>
                    <button className={styles.submit} type='submit' disabled={submitting}>{editMode ? "Update Job" : "Publish Job"}</button>
                </div>
            </form>
            {selectSkillsOpen && (
                <Modal isOpen={selectSkillsOpen} onClose={() => setSelectSkillsOpen(false)}>
                    <SelectOptions type={'Skills'} optionsList={skillOptions} selector={setSelectedSkills} chosenOptions={selectedSkills} setSelectOptionsPanel={setSelectSkillsOpen} />
                </Modal>
            )}
            {selectTagsOpen && (
                <Modal isOpen={selectTagsOpen} onClose={() => setSelectTagsOpen(false)}>
                    <SelectOptions type={'Tags'} optionsList={tagOptions} selector={setSelectedTags} chosenOptions={selectedTags} setSelectOptionsPanel={setSelectTagsOpen} />
                </Modal>
            )}
        </div>
    )
}
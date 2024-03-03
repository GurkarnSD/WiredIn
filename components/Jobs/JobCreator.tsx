import styles from '../styles/Jobs/Jobs.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Modal from '../Modal';
import { User } from '@/types';

export default function JobCreator(params: { user: User, skillOptions: { skill: string }[], tagOptions: { tag: string }[] }) {

    const { user, skillOptions, tagOptions } = params;

    const [jobForm, setJobForm] = useState({
        title: '',
        location: '',
        desc: '',
        salary: '',
        hourly: '',
        start: '',
        end: ''
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setJobForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectSkillsOpen, setSelectSkillsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectTagsOpen, setSelectTagsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { title, location, desc, salary, hourly, start, end } = jobForm;

        const job = {
            title,
            location,
            description: desc,
            skills: selectedSkills,
            tags: selectedTags,
            salary: parseInt(salary),
            hourly: parseFloat(hourly),
            start: start + '-01T00:00:00.000Z',
            end: end + '-01T00:00:00.000Z',
        }

        console.log(job)

        const res = await fetch('/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user.uid, job })
        })

        if (!res.ok) {
            throw new Error('Failed to Publish Job');
        }

        return res.json();
    }

    return (
        <div className={styles.jobCreator}>
            <h1 className={styles.title2}>Job Creator</h1>
            <form className={styles.jobForm} onSubmit={handleSubmit}>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Position Title</div>
                        <input className={styles.input} name='title' onChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Location</div>
                        <input className={styles.input} name='location' onChange={handleChange} />
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
                        <input className={styles.input} type='number' step='0.01' name='hourly' onChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Salary</div>
                        <input className={styles.input} type='number' name='salary' onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>From</div>
                        <input className={styles.input} type='month' name='start' onChange={handleChange} />
                    </div>
                    <FontAwesomeIcon icon={faArrowsLeftRight} className={styles.arrowIcon} />
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>To</div>
                        <input className={styles.input} type='month' name='end' onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormRow}>
                    <div className={styles.largeInputContainer}>
                        <div className={styles.inputTitle}>Description</div>
                        <textarea className={styles.desc} aria-multiline name='desc' onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.jobFormFooter}>
                    <button className={styles.submit} type='submit'>Publish Job</button>
                </div>
            </form>
            {selectSkillsOpen && (
                <Modal isOpen={selectSkillsOpen} onClose={() => setSelectSkillsOpen(false)}>
                    <SelectOptions type={'Skills'} optionsList={skillOptions} selector={setSelectedSkills} chosenOptions={selectedSkills} />
                </Modal>
            )}
            {selectTagsOpen && (
                <Modal isOpen={selectTagsOpen} onClose={() => setSelectTagsOpen(false)}>
                    <SelectOptions type={'Tags'} optionsList={tagOptions} selector={setSelectedTags} chosenOptions={selectedTags} />
                </Modal>
            )}
        </div>
    )
}

function SelectOptions(params: { type: string, optionsList: { [key: string]: string }[], selector: (options: string[]) => void, chosenOptions: string[] }) {

    const { type, optionsList, selector, chosenOptions } = params;

    const [inputValue, setInputValue] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<string[]>(chosenOptions);

    const options = optionsList.map((option: { [key: string]: string }) => option[Object.keys(option)[0]]);

    const filteredOptions = options.filter((option: string) =>
        option.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleOptionSelection = (skill: string) => {
        if (selectedOptions.includes(skill)) {
            setSelectedOptions(selectedOptions.filter((s) => s !== skill));
            return;
        }
        setSelectedOptions([...selectedOptions, skill]);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        selector(selectedOptions);
    }

    return (
        <form className={styles.selectOptionsMenu} onSubmit={handleSubmit}>
            <div className={styles.title}>Select {type}</div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.largeInput}
                    type="text"
                    placeholder={`Search ${type}`}
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div className={styles.selectionBox}>
                    {filteredOptions.map((option: string, index: number) => (
                        <label key={index} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionSelection(option)}
                                className={styles.customCheckbox}
                            />
                            <span className={styles.checkboxCustom}></span>
                            &nbsp;{option}
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.optionFooter}>
                <button className={styles.selectButton} type='submit'>Save</button>
            </div>
        </form>
    )
}
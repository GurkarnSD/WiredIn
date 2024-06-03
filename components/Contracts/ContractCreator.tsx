import styles from '../styles/Contracts/Contracts.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import Modal from '../Modal';
import SelectOptions from '../SelectOptions';
import { UserContract } from '@/types';

export default function ContractCreator(params: { skillOptions: { skill: string }[], tagOptions: { tag: string }[], setModal?: (isOpen: boolean) => void, toastTrigger?: () => void, editMode?: boolean, contract?: UserContract, onSuccess?: () => void }) {

    const { skillOptions, tagOptions, setModal, toastTrigger, editMode, contract, onSuccess } = params;

    const [contractForm, setContractForm] = useState({
        title: editMode && contract ? contract.title : '',
        location: editMode && contract ? contract.location : '',
        desc: editMode && contract ? contract.description : ''
    })
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const contractId = editMode && contract ? contract.uid : '';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContractForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }))
    }

    const [selectedSkills, setSelectedSkills] = useState<string[]>(editMode && contract ? contract.skills.map((skill) => { return skill.skill }) : []);
    const [selectSkillsOpen, setSelectSkillsOpen] = useState(false);
    const [selectedTags, setSelectedTags] = useState<string[]>(editMode && contract ? contract.tags.map((tag) => { return tag.tag }) : []);
    const [selectTagsOpen, setSelectTagsOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError('');
        setSubmitting(true);

        const { title, location, desc } = contractForm;

        const contract = {
            title,
            location,
            description: desc,
            skills: selectedSkills,
            tags: selectedTags
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

        let res = null;

        if (!editMode) {
            res = await fetch('/api/contracts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contract })
            })
        } else {
            res = await fetch(`/api/contracts`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contract: { id: contractId, ...contract } })
            })
        }

        if (!res.ok) {
            if (!editMode) {
                throw new Error('Failed to Publish Contract');
            } else {
                throw new Error('Failed to Update Contract');
            }
        } else {
            setContractForm({
                title: '',
                location: '',
                desc: ''
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
        <div className={styles.contractCreator}>
            <div className={styles.contractCreatorHeader}>
                <h1 className={styles.title2}>Contract {editMode ? 'Editor' : 'Creator'}</h1>
                {error && <div className={styles.error}>{error}</div>}
            </div>
            <form className={styles.contractForm} onSubmit={handleSubmit}>
                <div className={styles.contractFormRow}>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Position Title</div>
                        <input className={styles.input} name='title' value={contractForm.title} onChange={handleChange} />
                    </div>
                    <div className={styles.inputContainer}>
                        <div className={styles.inputTitle}>Location</div>
                        <input className={styles.input} name='location' value={contractForm.location} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.contractFormRow}>
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
                <div className={styles.contractFormRow}>
                    <div className={styles.largeInputContainer}>
                        <div className={styles.inputTitle}>Description</div>
                        <textarea className={styles.desc} aria-multiline name='desc' value={contractForm.desc} onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.contractFormFooter}>
                    <button className={styles.submit} type='submit' disabled={submitting}>{editMode ? "Update Contract" : "Publish Contract"}</button>
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
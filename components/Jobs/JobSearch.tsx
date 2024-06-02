'use client';
import styles from '../styles/Jobs/Jobs.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { User, UserJob } from '@/types'
import Job from './Job'
import SelectOptions from '../SelectOptions';
import Modal from '../Modal';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json())

const fetchJobs = async (page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/jobs/?page=${page}&pageSize=${pageSize}`)

    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }

    return res.json()
}

const searchJobs = async (title: string, skills: string[], tags: string[], page: number = 1, pageSize: number = 10) => {

    let url = `/api/jobs/search/?page=${page}&pageSize=${pageSize}`

    if (title.length > 0) {
        url += `&title=${title}`;
    }

    if (skills.length > 0) {
        const skillsString = skills.join(',');
        url += `&skills=${skillsString}`;
    }

    if (tags.length > 0) {
        const tagsString = tags.join(',');
        url += `&tags=${tagsString}`;
    }

    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }

    return res.json()
}

export default function JobSearch(params: { user: User }) {

    const [jobs, setJobs] = useState<UserJob[]>([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [openFilterPanel, setOpenFilterPanel] = useState(false);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { user } = params;

    const loadMoreJobs = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreJobs = async () => {
            if (!searchMode) {
                const newJobs = await fetchJobs(page);
                if (newJobs.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
            } else {
                const newJobs = await searchJobs(searchInput, selectedSkills, selectedTags, page);
                if (newJobs.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
            }
        };
        fetchMoreJobs();
    }, [page]);

    const handleSearch = async () => {
        if (searchInput === '' && selectedSkills.length === 0 && selectedTags.length === 0) {
            const newJobs = await fetchJobs(page);
            setJobs(newJobs);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setSearchMode(false);
        } else {
            const newJobs = await searchJobs(searchInput, selectedSkills, selectedTags, page);
            setJobs(newJobs);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setSearchMode(true);
        }
        setPage(1);
        return;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Job Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} onClick={() => setOpenFilterPanel(!openFilterPanel)} />
                    </div>
                    <button className={styles.searchButton} onClick={handleSearch}>Search Jobs</button>
                </div>
                {openFilterPanel && <SearchFilters setSelectedSkills={setSelectedSkills} selectedSkills={selectedSkills} setSelectedTags={setSelectedTags} selectedTags={selectedTags} setOpenFilterPanel={setOpenFilterPanel} />}
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Jobs Avaliable</h1>
                    <Link href={'/myjobs'} className={styles.jobsButton}>View My Jobs</Link>
                </div>
            </div>
            <div className={styles.searchResults}>
                {jobs.map((job: UserJob) =>
                    <Job key={job.id} job={job} user={user} />
                )}
            </div>
            {showLoadMore && <button className={styles.loadMore} onClick={() => loadMoreJobs()}>Load More</button>}
        </div>
    )
}

function SearchFilters(params: { setSelectedSkills: (options: string[]) => void, selectedSkills: string[], setSelectedTags: (options: string[]) => void, selectedTags: string[], setOpenFilterPanel: (state: boolean) => void }) {
    const { data: skillOptions } = useSWR('/api/profile/skills', fetcher)
    const { data: tagOptions } = useSWR('/api/tags', fetcher)
    const [selectSkillsOpen, setSelectSkillsOpen] = useState(false);
    const [selectTagsOpen, setSelectTagsOpen] = useState(false);

    const { setSelectedSkills, selectedSkills, setSelectedTags, selectedTags, setOpenFilterPanel } = params;

    return (
        <div className={styles.filterContainer}>
            <div className={styles.filterPanelHeader}>
                <h1 className={styles.smallTitle}>Filters</h1>
            </div>
            <div className={styles.filterFormRow}>
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
        </div >
    )
}
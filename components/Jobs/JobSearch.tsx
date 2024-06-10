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
import { useSearchParams, useRouter } from 'next/navigation'

const searchJobs = async (title: string, skills: string[], tags: string[], openFilterPanel: boolean, page: number = 1, pageSize: number = 10) => {

    let url = `/api/jobs/search?page=${page}&pageSize=${pageSize}`

    if (title.length > 0) {
        url += `&title=${encodeURIComponent(title)}`;
    }

    if (skills.length > 0 && openFilterPanel) {
        const skillsString = encodeURIComponent(skills.join(','));
        url += `&skills=${skillsString}`;
    }

    if (tags.length > 0 && openFilterPanel) {
        const tagsString = encodeURIComponent(tags.join(','));
        url += `&tags=${tagsString}`;
    }

    const res = await fetch(url)

    if (!res.ok) {
        throw new Error("Failed to fetch jobs")
    }

    return res.json()
}

export default function JobSearch(params: { user: User }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [jobs, setJobs] = useState<UserJob[]>([]);
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    const searchInputParam = searchParams.get('title');
    const [searchInput, setSearchInput] = useState(searchInputParam ? decodeURIComponent(searchInputParam) : '');
    const [showLoadMore, setShowLoadMore] = useState(false);
    const skillsParam = searchParams.get('skills');
    const [selectedSkills, setSelectedSkills] = useState<string[]>(
        skillsParam ? decodeURIComponent(skillsParam).split(',') : []
    );
    const tagsParam = searchParams.get('tags');
    const [selectedTags, setSelectedTags] = useState<string[]>(
        tagsParam ? decodeURIComponent(tagsParam).split(',') : []
    );
    const [openFilterPanel, setOpenFilterPanel] = useState(selectedSkills.length > 0 || selectedTags.length > 0 ? true : false);

    const { user } = params;

    useEffect(() => {
        const fetchMoreJobs = async () => {
            const newJobs = await searchJobs(searchInput, selectedSkills, selectedTags, openFilterPanel, page);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setJobs(newJobs);
        };
        fetchMoreJobs();
    }, [searchParams]);

    const loadMoreJobs = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreJobs = async () => {
            const newJobs = await searchJobs(searchInput, selectedSkills, selectedTags, openFilterPanel, page);
            if (newJobs.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setJobs((prevJobs: UserJob[]) => [...prevJobs, ...newJobs]);
        };
        if (page > 1) {
            fetchMoreJobs();
        }
    }, [page]);

    const handleSearch = async (title: string, skills: string[], tags: string[], page: number = 1) => {
        let url = '/jobs';

        if (page > 1) {
            url += `?page=${page}`;
        }

        if (title.length > 0) {
            url += `${url.includes('?') ? '&' : '?'}title=${encodeURIComponent(title)}`;
        }

        if (skills.length > 0 && openFilterPanel) {
            const skillsString = encodeURIComponent(skills.join(','));
            url += `${url.includes('?') ? '&' : '?'}skills=${skillsString}`;
        }

        if (tags.length > 0 && openFilterPanel) {
            const tagsString = encodeURIComponent(tags.join(','));
            url += `${url.includes('?') ? '&' : '?'}tags=${tagsString}`;
        }

        router.push(url);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Job Title" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} onClick={() => setOpenFilterPanel(!openFilterPanel)} />
                    </div>
                    <button className={styles.searchButton} onClick={() => handleSearch(searchInput, selectedSkills, selectedTags)}>Search Jobs</button>
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
'use client';
import styles from '../styles/Contracts/Contracts.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter, faPlus } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { User, UserContract } from '@/types'
import Contract from './Contract'
import SelectOptions from '../SelectOptions';
import Modal from '../Modal';
import useSWR from 'swr';
const fetcher = (url: string) => fetch(url).then(r => r.json())

const fetchContracts = async (page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/contracts/?page=${page}&pageSize=${pageSize}`)

    if (!res.ok) {
        throw new Error("Failed to fetch contracts")
    }

    return res.json()
}

const searchContracts = async (title: string, skills: string[], tags: string[], page: number = 1, pageSize: number = 10,) => {

    let url = `/api/contracts/search/?page=${page}&pageSize=${pageSize}`

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
        throw new Error("Failed to fetch contracts")
    }

    return res.json()
}

export default function ContractSearch(params: { user: User }) {

    const [contracts, setContracts] = useState<UserContract[]>([]);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchMode, setSearchMode] = useState(false);
    const [openFilterPanel, setOpenFilterPanel] = useState(false);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const { user } = params;

    const loadMoreContracts = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMoreContracts = async () => {
            if (!searchMode) {
                const newContracts = await fetchContracts(page);
                if (newContracts.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setContracts((prevContracts: UserContract[]) => [...prevContracts, ...newContracts]);
            } else {
                const newContracts = await searchContracts(searchInput, selectedSkills, selectedTags, page);
                if (newContracts.length < 10) {
                    setShowLoadMore(false);
                } else {
                    setShowLoadMore(true);
                }
                setContracts((prevContracts: UserContract[]) => [...prevContracts, ...newContracts]);
            }
        }
        fetchMoreContracts();
    }, [page]);

    const handleSearch = async () => {
        if (searchInput === '' && selectedSkills.length === 0 && selectedTags.length === 0) {
            const newContracts = await fetchContracts(page);
            setContracts(newContracts);
            if (newContracts.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setSearchMode(false);
        } else {
            const newContracts = await searchContracts(searchInput, selectedSkills, selectedTags, page);
            setContracts(newContracts);
            if (newContracts.length < 10) {
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
                        <input className={styles.searchInput} type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Contract Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} onClick={() => setOpenFilterPanel(!openFilterPanel)} />
                    </div>
                    <button className={styles.searchButton} onClick={handleSearch}>Search Contracts</button>
                </div>
                {openFilterPanel && <SearchFilters setSelectedSkills={setSelectedSkills} selectedSkills={selectedSkills} setSelectedTags={setSelectedTags} selectedTags={selectedTags} setOpenFilterPanel={setOpenFilterPanel} />}
                <div className={styles.headerRow}>
                    <h1 className={styles.title}>Contracts Avaliable</h1>
                    <Link href={'/mycontracts'} className={styles.contractsButton}>View My Contracts</Link>
                </div>
            </div>
            <div className={styles.searchResults}>
                {contracts.map((contract: UserContract) =>
                    <Contract key={contract.id} contract={contract} user={user} />
                )}
            </div>
            {showLoadMore && <button className={styles.loadMore} onClick={() => loadMoreContracts()}>Load More</button>}
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
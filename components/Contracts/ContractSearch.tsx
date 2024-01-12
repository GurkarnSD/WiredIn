import styles from '../styles/Contracts/Contracts.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { User, UserContract } from '@/types'
import Contract from './Contract'

export default function ContractSearch(params: { contracts: UserContract[], user: User }) {

    const { contracts, user } = params;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerRow}>
                    <div className={styles.searchBar}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
                        <input className={styles.searchInput} type="text" placeholder="Contract Title, Skills, or Technologies" />
                        <FontAwesomeIcon icon={faFilter} className={styles.searchIcon} />
                    </div>
                    <button className={styles.searchButton}>Search Contracts</button>
                </div>
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
        </div>
    )
}
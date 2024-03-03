'use client';
import styles from '../styles/Contracts/Contracts.module.css'
import { useState } from 'react';
import Modal from '../Modal';
import ContractCreator from './ContractCreator'
import Contract from './Contract';
import useSWR from 'swr';
import { UserContract, User } from '@/types';
const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function MyContracts(params: { user: User }) {

    const { user } = params

    const { data: skillOptions } = useSWR('/api/profile/skills', fetcher)
    const { data: tagOptions } = useSWR('/api/tags', fetcher)
    const { data: userContracts } = useSWR(`/api/contracts/user/?uid=${user.uid}`, fetcher)
    const [showContractCreator, setShowContractCreator] = useState(false)

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.title}>My Contracts</h1>
                        <button className={styles.contractsButton} onClick={() => setShowContractCreator(true)}>Create a Contract</button>
                    </div>
                </div>
                <div>
                    {userContracts && userContracts.map((contract: UserContract) => {
                        return (
                            <Contract key={contract.id} contract={contract} user={user} />
                        )
                    })}
                </div>
            </div>
            {showContractCreator &&
                <Modal isOpen={showContractCreator} onClose={() => setShowContractCreator(false)}>
                    <ContractCreator user={user} skillOptions={skillOptions} tagOptions={tagOptions} />
                </Modal>
            }
        </>
    )
}
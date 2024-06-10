'use client';
import styles from "../styles/Feed/UserSearch.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react";
import Modal from "../Modal";
import UserSearchBar from "./UserSearchBar";

export default function UserSearch() {

    const [openSearch, setOpenSearch] = useState(false);

    return (
        <>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} onClick={() => setOpenSearch(true)} />
            <Modal isOpen={openSearch} onClose={() => setOpenSearch(false)} closeIcon disableClickOff>
                <UserSearchBar />
            </Modal>
        </>
    );
}
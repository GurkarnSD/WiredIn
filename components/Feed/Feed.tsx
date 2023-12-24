'use client';
import styles from "../styles/Feed/Feed.module.css";
import { useState } from 'react';
import Modal from "../Modal";
import PostCreator from "./PostCreator";
import Post from "./Post";

export default function Feed(params: { user: any, posts: [] }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user, posts } = params;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.createPost} onClick={() => { setIsModalOpen(true) }}>Create Post</button>
            </div>
            <div className={styles.messages}>
                {posts.map((post) => {
                    return (
                        <Post key={post} data={post} user={user} />
                    );
                })}
            </div>

            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <PostCreator user={user} />
                </Modal>
            )}
        </div>
    )
}
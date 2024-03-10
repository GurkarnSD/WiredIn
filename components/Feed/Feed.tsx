'use client';
import styles from "../styles/Feed/Feed.module.css";
import { useState, useEffect, useRef } from 'react';
import Modal from "../Modal";
import PostCreator from "./PostCreator";
import Post from "./Post";
import { User, UserPost } from "@/types";
import { Toaster, toast } from 'sonner'

const fetchPosts = async (uid: string, page: number = 1, pageSize: number = 10) => {
    const res = await fetch(`/api/feed/posts/?uid=${uid}&page=${page}&pageSize=${pageSize}`)

    if (!res.ok) {
        throw new Error("Failed to fetch posts")
    }

    return res.json()
}

export default function Feed(params: { user: User }) {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState<UserPost[]>([]);
    const [page, setPage] = useState(1);
    const [showLoadMore, setShowLoadMore] = useState(false);
    const { user } = params;

    const loadMorePosts = async () => {
        setPage((prevPage) => prevPage + 1);
    };

    useEffect(() => {
        const fetchMorePosts = async () => {
            const newPosts = await fetchPosts(user.uid, page);
            if (newPosts.length < 10) {
                setShowLoadMore(false);
            } else {
                setShowLoadMore(true);
            }
            setPosts((prevPosts: UserPost[]) => [...prevPosts, ...newPosts]);
        };
        fetchMorePosts();
    }, [page]);

    return (
        <div className={styles.container}>
            <Toaster position="top-right" />
            <div className={styles.header}>
                <button className={styles.createPost} onClick={() => { setIsModalOpen(true) }}>Create Post</button>
            </div>
            <div className={styles.posts}>
                {posts.map((post) => {
                    return (
                        <Post key={post.uid} data={post} user={user} />
                    );
                })}
            </div>
            {showLoadMore && <button className={styles.loadMore} onClick={() => loadMorePosts()}>Load More</button>}
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <PostCreator user={user} setModal={setIsModalOpen} toastTrigger={() => toast.success('Post Created')} />
                </Modal>
            )}
        </div>
    )
}
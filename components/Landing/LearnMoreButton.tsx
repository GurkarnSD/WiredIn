'use client';
import styles from '@/styles/Home.module.css';

export default function LearnMoreButton() {
    const handleClick = () => {
        const element = document.getElementById('LearnMore');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <button className={styles.mainButton} onClick={handleClick}>
            Learn More
        </button>
    );
};
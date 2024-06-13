"use client";
import styles from '@/styles/Home.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faFileContract, faPlug, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { useInView } from 'react-intersection-observer';

function ProfileTimeline() {
    const { ref: profileRef, inView: profileInView } = useInView({
        threshold: 0.05,
        triggerOnce: false,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faBolt} height={50} width={50} />
            <div className={`${styles.profileTimeline} ${profileInView ? styles.fadeIn : ''}`} ref={profileRef} />
        </div>
    )
}

function FeedTimeline() {
    const { ref: feedRef, inView: feedInView } = useInView({
        threshold: 0.05,
        triggerOnce: false,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faPlug} height={50} width={50} />
            <div className={`${styles.feedTimeline} ${feedInView ? styles.fadeIn : ''}`} ref={feedRef} />
        </div>
    )
}

function ContractsTimeline() {
    const { ref: contractsRef, inView: contractsInView } = useInView({
        threshold: 0.05,
        triggerOnce: false,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faFileContract} height={50} width={50} />
            <div className={`${styles.contractsTimeline} ${contractsInView ? styles.fadeIn : ''}`} ref={contractsRef} />
        </div>
    )
}

function JobsTimeline() {
    const { ref: jobsRef, inView: jobsInView } = useInView({
        threshold: 0.05,
        triggerOnce: false,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faSuitcase} height={50} width={50} />
            <div className={`${styles.jobsTimeline} ${jobsInView ? styles.fadeIn : ''}`} ref={jobsRef} />
        </div>
    )
}

function ClosingTimeline() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faCircleDot} height={50} width={50} />
            <div className={styles.timelinePlaceHolder} />
        </div>
    )
}

export { ProfileTimeline, FeedTimeline, ContractsTimeline, JobsTimeline, ClosingTimeline }
'use client';
import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import Amazon from '@/assets/Amazon.webp';
import Microsoft from '@/assets/Microsoft.webp';
import Meta from '@/assets/Meta.webp';
import Google from '@/assets/Google.webp';
import Netflix from '@/assets/Netflix.webp';
import Spotify from '@/assets/Spotify.webp';
import { useInView } from 'react-intersection-observer';

export default function ProfileShowcase() {

    const { ref: profileShowcaseRef, inView: profileShowcaseInView } = useInView({
        threshold: 0.1,
        triggerOnce: false,
    });

    return (
        <div className={`${styles.profileShowcase} ${profileShowcaseInView ? styles.slideInFadeIn : ''}`} ref={profileShowcaseRef}>
            <div className={styles.profileShowcaseButtons}><div className={styles.redCircle} /><div className={styles.yellowCircle} /><div className={styles.greenCircle} /></div>
            <div className={styles.profileShowcaseWindow}>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Amazon}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>Software Developer</div>
                                <div className={styles.experienceCompany}>Amazon</div>
                                <div className={styles.experienceDate}>2023</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>React,&nbsp;</div>
                                    <div className={styles.skill}>SQL,&nbsp;</div>
                                    <div className={styles.skill}>Typescript&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Google}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>Data Analyst</div>
                                <div className={styles.experienceCompany}>Google</div>
                                <div className={styles.experienceDate}>2022</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>Python,&nbsp;</div>
                                    <div className={styles.skill}>SQL,&nbsp;</div>
                                    <div className={styles.skill}>Data Viz&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Netflix}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>Full Stack Developer</div>
                                <div className={styles.experienceCompany}>Netflix</div>
                                <div className={styles.experienceDate}>2021</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>Node.js,&nbsp;</div>
                                    <div className={styles.skill}>React,&nbsp;</div>
                                    <div className={styles.skill}>MongoDB&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Microsoft}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>Backend Developer</div>
                                <div className={styles.experienceCompany}>Microsoft</div>
                                <div className={styles.experienceDate}>2020</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>C#,&nbsp;</div>
                                    <div className={styles.skill}>.NET,&nbsp;</div>
                                    <div className={styles.skill}>SQL Server&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Meta}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>Frontend Developer</div>
                                <div className={styles.experienceCompany}>Meta</div>
                                <div className={styles.experienceDate}>2019</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>React,&nbsp;</div>
                                    <div className={styles.skill}>JavaScript,&nbsp;</div>
                                    <div className={styles.skill}>CSS&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileBox}>
                    <div className={styles.experienceHeader}>
                        <div className={styles.experienceLeft}>
                            <Image
                                className={styles.experienceImage}
                                src={Spotify}
                                alt={'Experience Image'}
                            />
                            <div className={styles.experienceInfo}>
                                <div className={styles.experienceTitle}>DevOps Engineer</div>
                                <div className={styles.experienceCompany}>Spotify</div>
                                <div className={styles.experienceDate}>2018</div>
                                <div className={styles.skills}>
                                    <div>Skills:&nbsp;</div>
                                    <div className={styles.skill}>AWS,&nbsp;</div>
                                    <div className={styles.skill}>Docker,&nbsp;</div>
                                    <div className={styles.skill}>Kubernetes&nbsp;</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
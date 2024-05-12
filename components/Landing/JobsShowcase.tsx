import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import AliceSmith from '@/assets/AliceSmith.jpg';
import BobJohnson from '@/assets/BobJohnson.png';
import CharlieBrown from '@/assets/CharlieBrown.jpg';

export default function JobsShowcase() {
    return (
        <div className={styles.jobsContainer}>
            <div className={styles.jobGroup1}>
                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={AliceSmith} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>AliceSmith</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Software Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;JavaScript, React, Node.js
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Salary:</h4>&nbsp;$120,000
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 0, 15).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 3, 15).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                A seasoned software developer with expertise in building scalable web applications using modern JavaScript frameworks.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>JavaScript</div>
                                    <div className={styles.tag}>React</div>
                                    <div className={styles.tag}>Node.js</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={BobJohnson} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>BobJohnson</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Frontend Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;HTML, CSS, JavaScript
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Hourly Rate:</h4>&nbsp;$50
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 6, 10).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 10, 10).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                An experienced frontend developer proficient in building responsive and visually appealing user interfaces.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>HTML</div>
                                    <div className={styles.tag}>CSS</div>
                                    <div className={styles.tag}>JavaScript</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={CharlieBrown} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>CharlieBrown</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Backend Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;Java, Spring Boot, SQL
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Salary:</h4>&nbsp;$100,000
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 2, 5).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 6, 5).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                A skilled backend developer experienced in designing and implementing robust server-side systems.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>Java</div>
                                    <div className={styles.tag}>Spring Boot</div>
                                    <div className={styles.tag}>SQL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Duplicated Jobs For Infinite Scroll */}
            <div className={styles.jobGroup2}>
                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={AliceSmith} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>AliceSmith</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Software Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;JavaScript, React, Node.js
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Salary:</h4>&nbsp;$120,000
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 0, 15).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 3, 15).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                A seasoned software developer with expertise in building scalable web applications using modern JavaScript frameworks.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>JavaScript</div>
                                    <div className={styles.tag}>React</div>
                                    <div className={styles.tag}>Node.js</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={BobJohnson} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>BobJohnson</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Frontend Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;HTML, CSS, JavaScript
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Hourly Rate:</h4>&nbsp;$50
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 6, 10).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 10, 10).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                An experienced frontend developer proficient in building responsive and visually appealing user interfaces.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>HTML</div>
                                    <div className={styles.tag}>CSS</div>
                                    <div className={styles.tag}>JavaScript</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.jobContainer}>
                    <div className={styles.job}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={CharlieBrown} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>CharlieBrown</h2>
                        </div>
                        <div className={styles.jobInfo}>
                            <div className={styles.jobInfoHeader}>
                                <div>
                                    <h2 className={styles.jobTitle}>Backend Developer</h2>
                                    <h4 className={styles.jobLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.jobSkills}>
                                <h4>Skills:</h4>&nbsp;Java, Spring Boot, SQL
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Salary:</h4>&nbsp;$100,000
                            </div>
                            <div className={styles.jobDetails}>
                                <h4>Start:</h4>&nbsp;{new Date(2024, 2, 5).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                <div className={styles.jobDetails}>
                                    &nbsp;<h4>End:</h4>&nbsp;{new Date(2024, 6, 5).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                                </div>
                            </div>
                            <div className={styles.jobDescription}>
                                A skilled backend developer experienced in designing and implementing robust server-side systems.
                            </div>
                            <div className={styles.jobInfoFooter}>
                                <div className={styles.jobTags}>
                                    <div className={styles.tag}>Java</div>
                                    <div className={styles.tag}>Spring Boot</div>
                                    <div className={styles.tag}>SQL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
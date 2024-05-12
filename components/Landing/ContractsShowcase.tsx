import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import AliceSmith from '@/assets/AliceSmith.jpg';
import BobJohnson from '@/assets/BobJohnson.png';
import CharlieBrown from '@/assets/CharlieBrown.jpg';

export default function ContractsShowcase() {
    return (
        <div className={styles.contractsContainer}>
            <div className={styles.contractGroup1}>
                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={AliceSmith} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>AliceSmith</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Online Store Project</h2>
                                    <h4 className={styles.contractLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;JavaScript, React, Node.js
                            </div>
                            <div className={styles.contractDescription}>
                                This contract involves building a web application using React and Node.js.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Discord</div>
                                    <div className={styles.tag}>Web Development</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={BobJohnson} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>BobJohnson</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Exciting Project</h2>
                                    <h4 className={styles.contractLocation}>On-site</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;Python, Django, PostgreSQL
                            </div>
                            <div className={styles.contractDescription}>
                                This project requires building a Django web application with PostgreSQL database.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Python</div>
                                    <div className={styles.tag}>Django</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={CharlieBrown} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>CharlieBrown</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Data Analysis Project</h2>
                                    <h4 className={styles.contractLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;Python, Pandas, SQL
                            </div>
                            <div className={styles.contractDescription}>
                                This project involves analyzing large datasets using Python and SQL for actionable insights.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Data Analysis</div>
                                    <div className={styles.tag}>Python</div>
                                    <div className={styles.tag}>SQL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Duplicated Contracts For Infinite Scroll */}
            <div className={styles.contractGroup2}>
                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={AliceSmith} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>AliceSmith</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Online Store Project</h2>
                                    <h4 className={styles.contractLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;JavaScript, React, Node.js
                            </div>
                            <div className={styles.contractDescription}>
                                This contract involves building a web application using React and Node.js.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Discord</div>
                                    <div className={styles.tag}>Web Development</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={BobJohnson} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>BobJohnson</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Exciting Project</h2>
                                    <h4 className={styles.contractLocation}>On-site</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;Python, Django, PostgreSQL
                            </div>
                            <div className={styles.contractDescription}>
                                This project requires building a Django web application with PostgreSQL database.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Python</div>
                                    <div className={styles.tag}>Django</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.contractContainer}>
                    <div className={styles.contract}>
                        <div className={styles.userInfo}>
                            <Image className={styles.userImage} src={CharlieBrown} alt='User Image' width={100} height={100} />
                            <h2 className={styles.userName}>CharlieBrown</h2>
                        </div>
                        <div className={styles.contractInfo}>
                            <div className={styles.contractInfoHeader}>
                                <div>
                                    <h2 className={styles.contractTitle}>Data Analysis Project</h2>
                                    <h4 className={styles.contractLocation}>Remote</h4>
                                </div>
                            </div>
                            <div className={styles.contractSkills}>
                                <h4>Skills:</h4>&nbsp;Python, Pandas, SQL
                            </div>
                            <div className={styles.contractDescription}>
                                This project involves analyzing large datasets using Python and SQL for actionable insights.
                            </div>
                            <div className={styles.contractInfoFooter}>
                                <div className={styles.contractTags}>
                                    <div className={styles.tag}>Data Analysis</div>
                                    <div className={styles.tag}>Python</div>
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
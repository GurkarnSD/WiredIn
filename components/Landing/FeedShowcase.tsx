import styles from '@/styles/Home.module.css'
import Image from 'next/image';
import Software1 from '@/assets/Software1.png';
import DataSci1 from '@/assets/DataSci1.png';
import DataSci2 from '@/assets/DataSci2.png';
import DataSci3 from '@/assets/DataSci3.png';
import DataSci4 from '@/assets/DataSci4.png';
import DataAn1 from '@/assets/DataAn1.png';
import DataAn2 from '@/assets/DataAn2.png';
import AliceSmith from '@/assets/AliceSmith.jpg';
import BobJohnson from '@/assets/BobJohnson.png';
import CharlieBrown from '@/assets/CharlieBrown.jpg';

export default function FeedShowcase() {
    return (
        <div className={styles.postsContainer}>
            <div className={styles.postGroup1}>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={AliceSmith} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>AliceSmith</div>
                                <div className={styles.profileTitle}>Data Analyst</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>2 Days Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            Exploring the world of data analysis! Each dataset is a unique adventure, and I love turning raw data into meaningful insights.
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.twoImages}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.medImage}`} src={DataAn1} alt={'Data Analysis Image 1'} width={0} height={0} unoptimized />
                                </div>
                                <div className={styles.imagesContainer2}>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.medImage}`} src={DataAn2} alt={'Data Analysis Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={BobJohnson} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>BobJohnson</div>
                                <div className={styles.profileTitle}>Software Engineer</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>1 Day Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            Coding is my superpower! Crafting software solutions that empower and innovate. Excited about the endless possibilities in the world of technology!
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.oneImage}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.largeImage}`} src={Software1} alt={'Software Engineering Image 1'} width={0} height={0} unoptimized />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={CharlieBrown} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>CharlieBrown</div>
                                <div className={styles.profileTitle}>Data Scientist</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>3 Hours Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            In the realm of data science, I navigate through the data jungle to uncover hidden gems. Algorithms, insights, and a touch of magic make it all happen!
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.fourImages}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.largeImage}`} src={DataSci1} alt={'Data Science Image 1'} width={0} height={0} unoptimized />
                                </div>
                                <div className={styles.imagesContainer2}>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci2} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci3} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci4} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Duplicated Posts For Infinite Scroll */}
            <div className={styles.postGroup2}>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={AliceSmith} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>AliceSmith</div>
                                <div className={styles.profileTitle}>Data Analyst</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>2 Days Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            Exploring the world of data analysis! Each dataset is a unique adventure, and I love turning raw data into meaningful insights.
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.twoImages}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.medImage}`} src={DataAn1} alt={'Data Analysis Image 1'} width={0} height={0} unoptimized />
                                </div>
                                <div className={styles.imagesContainer2}>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.medImage}`} src={DataAn2} alt={'Data Analysis Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={BobJohnson} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>BobJohnson</div>
                                <div className={styles.profileTitle}>Software Engineer</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>1 Day Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            Coding is my superpower! Crafting software solutions that empower and innovate. Excited about the endless possibilities in the world of technology!
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.oneImage}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.largeImage}`} src={Software1} alt={'Software Engineering Image 1'} width={0} height={0} unoptimized />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.postContainer}>
                    <div className={styles.postHeader}>
                        <div className={styles.postHeaderLeft}>
                            <Image className={styles.postProfile} src={CharlieBrown} alt={"Profile Pic"} height={50} width={50} />
                            <div className={styles.postInfo}>
                                <div className={styles.displayName}>CharlieBrown</div>
                                <div className={styles.profileTitle}>Data Scientist</div>
                            </div>
                        </div>
                        <div className={styles.postHeaderRight}>
                            <div className={styles.time}>3 Hours Ago</div>
                        </div>
                    </div>
                    <div className={styles.postBody}>
                        <div className={styles.text}>
                            In the realm of data science, I navigate through the data jungle to uncover hidden gems. Algorithms, insights, and a touch of magic make it all happen!
                        </div>
                        <div className={styles.images}>
                            <div className={`${styles.imagesContainer} ${styles.fourImages}`}>
                                <div className={styles.imageContainer}>
                                    <Image className={`${styles.image} ${styles.largeImage}`} src={DataSci1} alt={'Data Science Image 1'} width={0} height={0} unoptimized />
                                </div>
                                <div className={styles.imagesContainer2}>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci2} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci3} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                    <div className={styles.imageContainer}>
                                        <Image className={`${styles.image} ${styles.smallImage}`} src={DataSci4} alt={'Data Science Image 2'} width={0} height={0} unoptimized />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
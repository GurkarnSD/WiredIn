'use client';
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faFileContract, faPlug, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { faCircleDot } from '@fortawesome/free-regular-svg-icons';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import React from 'react';
import Image from 'next/image';
import Amazon from '@/assets/Amazon.png';
import Microsoft from '@/assets/Microsoft.png';
import Meta from '@/assets/Meta.png';
import Google from '@/assets/Google.png';
import Netflix from '@/assets/Netflix.png';
import Spotify from '@/assets/Spotify.png';
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
import { User } from '@/types';
import NavbarDropdown from '@/components/NavbarDropdown';
import { useRouter } from 'next/navigation';

async function getClientSession() {
  const session = await fetch('/api/auth/session');
  return await session.json();
}

export default function Home() {

  const [user, setUser] = useState<User>();
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getClientSession();
      console.log(session.user);
      setUser(session.user);
    };

    fetchSession();
  }, []);

  const { ref: profileRef, inView: profileInView } = useInView({
    threshold: 0.05,
    triggerOnce: false,
  });

  const { ref: feedRef, inView: feedInView } = useInView({
    threshold: 0.05,
    triggerOnce: false,
  });

  const { ref: contractsRef, inView: contractsInView } = useInView({
    threshold: 0.05,
    triggerOnce: false,
  });

  const { ref: jobsRef, inView: jobsInView } = useInView({
    threshold: 0.05,
    triggerOnce: false,
  });

  const { ref: profileShowcaseRef, inView: profileShowcaseInView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const infoRef = React.useRef<HTMLDivElement>(null);

  const scrollToInfo = () => {
    if (infoRef.current) infoRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.home}>
      <div className={styles.mainBar}>
        <svg onClick={() => { user ? router.push('/feed') : router.push('/') }} cursor='pointer' width="120px" height="120px" viewBox="-20 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.76"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M129.49 114.51C129.121 116.961 128.187 119.293 126.762 121.322C125.337 123.351 123.461 125.021 121.28 126.2C120.676 126.535 120.043 126.816 119.39 127.04C120.22 138.04 102.74 142.04 93.32 139.42L96.82 151.66L87.82 151.98L72.07 129.43C66.76 130.93 60.49 131.65 56.44 125.15C56.0721 124.553 55.7382 123.935 55.44 123.3C54.4098 123.51 53.3614 123.617 52.31 123.62C49.31 123.62 44.31 122.72 41.77 120.96C39.7563 119.625 38.1588 117.75 37.16 115.55C31.75 116.29 27.16 115.02 24.16 111.88C20.36 107.97 19.28 101.51 21.26 94.58C23.87 85.33 31.81 74.91 47.59 71C48.9589 69.2982 50.5972 67.8322 52.44 66.66C62.35 60.31 78.44 59.76 90.65 65.79C95.3836 64.9082 100.27 65.376 104.75 67.14C113.53 70.43 119.91 77.31 121.11 84.3C123.487 85.5317 125.433 87.4568 126.69 89.82C129.32 94.76 129.69 99.71 127.92 103.71C129.587 107.049 130.138 110.835 129.49 114.51ZM123.01 109.31C121.612 110.048 120.056 110.434 118.475 110.434C116.894 110.434 115.338 110.048 113.94 109.31L114.67 104.46C117.75 104.76 120.26 103.8 121.57 101.83C123.04 99.64 122.81 96.39 120.95 92.9C118.87 88.99 114.38 88.37 111.89 88.34H111.73C105.49 88.34 99.13 91.89 96.56 96.52L92.82 94.73C93.5553 92.3449 94.8046 90.15 96.48 88.3C95.0376 87.0754 93.9474 85.4887 93.3217 83.703C92.696 81.9173 92.5574 79.9971 92.92 78.14L96.61 77.8C96.7789 79.302 97.4 80.7172 98.3911 81.8583C99.3822 82.9994 100.697 83.8125 102.16 84.19C105.238 82.8161 108.58 82.1335 111.95 82.19C112.43 82.19 112.89 82.24 113.36 82.27C110.969 78.0312 107.18 74.7545 102.64 73C91.56 68.7 84.09 75.37 82.38 77.67C78.26 83.19 80.9 88.41 82.91 91.8L79.61 94.8C76.736 92.314 74.8075 88.9127 74.15 85.17C69.92 86.44 64.24 86.17 61.06 80.74L64.06 78.68C67.43 81.2 72.78 80.98 75.32 77.87C75.9252 76.4949 76.6905 75.1959 77.6 74C79.044 72.093 80.7864 70.4316 82.76 69.08C74.47 66.82 62.76 67.19 55.68 71.73C53.7668 72.841 52.192 74.4517 51.1244 76.3895C50.0569 78.3274 49.5368 80.5192 49.62 82.73C49.62 86.3 52.42 91.94 56.19 92.82L54 97.07C51.5946 96.5129 49.4109 95.2487 47.73 93.44L44.48 97.58L41.23 96L44.41 87.68C43.8904 86.064 43.624 84.3774 43.62 82.68C43.628 81.3361 43.7687 79.9963 44.04 78.68C34.04 82.81 29.1 89.68 27.29 95.96C25.9 100.79 26.44 105.15 28.72 107.49C30.53 109.35 33.3 109.79 35.91 109.62L42.91 104.17L45.21 106.11L43.13 112.93C44.22 116.4 47.79 118.19 54.3 116.93C54.6375 114.169 55.7272 111.554 57.45 109.37C58.7133 107.552 60.3846 106.056 62.33 105L65.75 95.79L69.17 95.64L68.8 103.19C74.55 102.6 80.98 103.77 86.97 102.87L88.07 106.87C79.29 110.93 70.3 104.31 62.15 113.04C59.22 116.18 60.34 118.91 62.15 121.66C64.76 125.59 69.66 123.23 74.67 121.66C82.26 119.34 87.77 117.66 98.16 118.51C95.68 113.8 95.92 108.11 99.24 101.85L104.13 103.78C100.7 111.69 103.91 116.27 106.13 118.29C109.56 121.41 114.72 122.35 118.13 120.47C119.436 119.749 120.559 118.737 121.412 117.513C122.265 116.289 122.825 114.885 123.05 113.41C123.275 112.051 123.258 110.663 123 109.31H123.01Z" fill="#ffffff"></path> </g></svg>
        <div className={styles.navigation}>
          {user &&
            <div className={styles.links}>
              <Link className={styles.link} href="/feed">
                Feed
              </Link>
              <Link className={styles.link} href="/contracts">
                Contracts
              </Link>
              <Link className={styles.link} href="/jobs">
                Jobs
              </Link>
            </div>
          }
          {user ? <NavbarDropdown user={user} lightMode={true} nav /> : <><Link className={styles.signupButton} href='/signup'>Sign Up</Link><Link className={styles.loginButton} href='/login'>Log In</Link></>}
        </div>
      </div>
      <div className={styles.mainSection}>
        <div className={styles.mainHeader}>
          <h1 className={styles.mainHook}>
            Start coding, <br />
            start connecting, <br />
            start now!
          </h1>
          <h2 className={styles.mainSub}>
            Join our community of developers and start building your dream project today.
          </h2>
          <div className={styles.mainButtons}>
            <button className={styles.mainButton} onClick={scrollToInfo}>
              Learn More
            </button>
            <Link className={styles.mainButton} href='/signup'>
              Get Started
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.wave}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 275"><path fill="#000000" fillOpacity="1" d="M0,192L60,170.7C120,149,240,107,360,112C480,117,600,171,720,176C840,181,960,139,1080,122.7C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
      </div>
      <div className={styles.additionalInfo}>
        <div className={styles.profileSection}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faBolt} />
            <div className={`${styles.profileTimeline} ${profileInView ? styles.fadeIn : ''}`} ref={profileRef} />
          </div>
          <div className={styles.content} ref={infoRef}>
            <h1 className={styles.contentTitle}>Elevate Your Profile</h1>
            <h2 className={styles.contentSubtitle}>Showcase your skills, experiences, and projects to create a comprehensive developer profile.</h2>
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
          </div>
        </div>
        <div className={styles.feedSection}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faPlug} />
            <div className={`${styles.feedTimeline} ${feedInView ? styles.fadeIn : ''}`} ref={feedRef} />
          </div>
          <div className={styles.content}>
            <h1 className={styles.contentTitle}>Plug Into The Feed</h1>
            <h2 className={styles.contentSubtitle}>Start your journey, gain insights, and build lasting connections.</h2>
            <div className={styles.feedShowcase}>
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
            </div>

          </div>
        </div >
        <div className={styles.contractsSection}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faFileContract} />
            <div className={`${styles.contractsTimeline} ${contractsInView ? styles.fadeIn : ''}`} ref={contractsRef} />
          </div>
          <div className={styles.content}>
            <h1 className={styles.contentTitle}>Collaborate on Your Terms</h1>
            <h2 className={styles.contentSubtitle}>Post projects, connect with like-minded individuals, and form your ideal team for shared success.</h2>
            <div className={styles.contractsShowcase}>

            </div>
          </div>
        </div>
        <div className={styles.jobsSection}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faSuitcase} />
            <div className={`${styles.jobsTimeline} ${jobsInView ? styles.fadeIn : ''}`} ref={jobsRef} />
          </div>
          <div className={styles.content}>
            <h1 className={styles.contentTitle}>Unlock Opportunities</h1>
            <h2 className={styles.contentSubtitle}>Discover and post job opportunities, connecting talent with ambition. Find your perfect match here.</h2>
            <div className={styles.jobsShowcase}>

            </div>
          </div>
        </div>
        <div className={styles.closingSection}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon className={styles.timelineIcon} icon={faCircleDot} />
            <div className={styles.timelinePlaceHolder} />
          </div>
          <div className={styles.content}>
            <h1 className={styles.contentTitle}>Get Started Today!</h1>
          </div>
        </div>
      </div >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 200">
        <path fill="#2d2d2d" fillOpacity="1" d="M0,128L40,112C80,96,160,64,240,64C320,64,400,96,480,128C560,160,640,192,720,186.7C800,181,880,139,960,128C1040,117,1120,139,1200,133.3C1280,128,1360,96,1400,80L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
      </svg>
      <div className={styles.homeFooter}>
        <div className={styles.footerHeader}>
          <div className={styles.headerItem}>
            <svg width="100px" height="100px" viewBox="-20 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.76"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M129.49 114.51C129.121 116.961 128.187 119.293 126.762 121.322C125.337 123.351 123.461 125.021 121.28 126.2C120.676 126.535 120.043 126.816 119.39 127.04C120.22 138.04 102.74 142.04 93.32 139.42L96.82 151.66L87.82 151.98L72.07 129.43C66.76 130.93 60.49 131.65 56.44 125.15C56.0721 124.553 55.7382 123.935 55.44 123.3C54.4098 123.51 53.3614 123.617 52.31 123.62C49.31 123.62 44.31 122.72 41.77 120.96C39.7563 119.625 38.1588 117.75 37.16 115.55C31.75 116.29 27.16 115.02 24.16 111.88C20.36 107.97 19.28 101.51 21.26 94.58C23.87 85.33 31.81 74.91 47.59 71C48.9589 69.2982 50.5972 67.8322 52.44 66.66C62.35 60.31 78.44 59.76 90.65 65.79C95.3836 64.9082 100.27 65.376 104.75 67.14C113.53 70.43 119.91 77.31 121.11 84.3C123.487 85.5317 125.433 87.4568 126.69 89.82C129.32 94.76 129.69 99.71 127.92 103.71C129.587 107.049 130.138 110.835 129.49 114.51ZM123.01 109.31C121.612 110.048 120.056 110.434 118.475 110.434C116.894 110.434 115.338 110.048 113.94 109.31L114.67 104.46C117.75 104.76 120.26 103.8 121.57 101.83C123.04 99.64 122.81 96.39 120.95 92.9C118.87 88.99 114.38 88.37 111.89 88.34H111.73C105.49 88.34 99.13 91.89 96.56 96.52L92.82 94.73C93.5553 92.3449 94.8046 90.15 96.48 88.3C95.0376 87.0754 93.9474 85.4887 93.3217 83.703C92.696 81.9173 92.5574 79.9971 92.92 78.14L96.61 77.8C96.7789 79.302 97.4 80.7172 98.3911 81.8583C99.3822 82.9994 100.697 83.8125 102.16 84.19C105.238 82.8161 108.58 82.1335 111.95 82.19C112.43 82.19 112.89 82.24 113.36 82.27C110.969 78.0312 107.18 74.7545 102.64 73C91.56 68.7 84.09 75.37 82.38 77.67C78.26 83.19 80.9 88.41 82.91 91.8L79.61 94.8C76.736 92.314 74.8075 88.9127 74.15 85.17C69.92 86.44 64.24 86.17 61.06 80.74L64.06 78.68C67.43 81.2 72.78 80.98 75.32 77.87C75.9252 76.4949 76.6905 75.1959 77.6 74C79.044 72.093 80.7864 70.4316 82.76 69.08C74.47 66.82 62.76 67.19 55.68 71.73C53.7668 72.841 52.192 74.4517 51.1244 76.3895C50.0569 78.3274 49.5368 80.5192 49.62 82.73C49.62 86.3 52.42 91.94 56.19 92.82L54 97.07C51.5946 96.5129 49.4109 95.2487 47.73 93.44L44.48 97.58L41.23 96L44.41 87.68C43.8904 86.064 43.624 84.3774 43.62 82.68C43.628 81.3361 43.7687 79.9963 44.04 78.68C34.04 82.81 29.1 89.68 27.29 95.96C25.9 100.79 26.44 105.15 28.72 107.49C30.53 109.35 33.3 109.79 35.91 109.62L42.91 104.17L45.21 106.11L43.13 112.93C44.22 116.4 47.79 118.19 54.3 116.93C54.6375 114.169 55.7272 111.554 57.45 109.37C58.7133 107.552 60.3846 106.056 62.33 105L65.75 95.79L69.17 95.64L68.8 103.19C74.55 102.6 80.98 103.77 86.97 102.87L88.07 106.87C79.29 110.93 70.3 104.31 62.15 113.04C59.22 116.18 60.34 118.91 62.15 121.66C64.76 125.59 69.66 123.23 74.67 121.66C82.26 119.34 87.77 117.66 98.16 118.51C95.68 113.8 95.92 108.11 99.24 101.85L104.13 103.78C100.7 111.69 103.91 116.27 106.13 118.29C109.56 121.41 114.72 122.35 118.13 120.47C119.436 119.749 120.559 118.737 121.412 117.513C122.265 116.289 122.825 114.885 123.05 113.41C123.275 112.051 123.258 110.663 123 109.31H123.01Z" fill="#000000"></path> </g></svg>
            <h1 className={styles.footerTitle}>WiredIn</h1>
            <div className={styles.socials}>

            </div>
          </div>
        </div>
        <div className={styles.vision}>
          Crafted with passion and a vision for community-driven collaboration, WiredIn is a side project evolving into a hub for coding enthusiasts. Your support fuels its growth. Join us on this journey, and let&apos;s shape the future of WiredIn together.
        </div>
        <div className={styles.footerInfo}>
          <h6 className={styles.footerInfoItem}>© 2023 Gurkarn Dhaliwal. All Rights Reserved.</h6>
        </div>
      </div>
    </div >
  )
}
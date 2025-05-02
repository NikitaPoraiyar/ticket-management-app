import React, { useEffect, useState } from 'react'
import styles from "../styles/landingpage.module.css"
import Logo from '../assets/logo.png'
import mainImg from '../assets/banner_img1.png';
import topImg from '../assets/banner_img2.png';
import bottomImg from '../assets/banner_img3.png';
import cmp1 from '../assets/company_logo1.png';
import cmp2 from '../assets/company_logo2.png';
import cmp3 from '../assets/company_logo3.png';
import cmp4 from '../assets/company_logo4.png';
import cmp5 from '../assets/company_logo5.png';
import cmp6 from '../assets/company_logo6.png';
import play from '../assets/play_btn.png';
import infoImg1 from '../assets/info_img1.png';
import infoImg2 from '../assets/info_img2.png';
import SocialImg from '../assets/socialImages.png';
import ChartIcon from '../assets/chatbtn.png';
import ChatbtnImg from '../assets/welcomeChatbotImg.png';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';


function LandingPage() {
    const [showchat, setShowchat] = useState("true");
    const [showChatbot, setShowChatbot] = useState(false);

    const navigate = useNavigate();

    const [chatbotStyles, setChatbotStyles] = useState({
            headerbgclr: "#33475B",
            bodybgclr: "#EEEEEE",
            message1: "How can I help you?",
            message2: "Ask me anything!",
            formlabelname: "Your name",
            formlabelphone: "Your phone",
            formlabelemail: "Your Email",
            welcomemessage: "Introduction Yourself",
            missedchattime: "60"
        });
    
    
        useEffect(() => {
            const fetchStyles = async () => {
                try {
                    const response = await fetch('https://ticket-management-app.onrender.com/api/users/styles');
                    if (response.ok) {
                        const data = await response.json();
                        if (data.data && data.data.length > 0) {
                            setChatbotStyles(data.data[0]); 
                            console.log("Fetched styles:", data.data[0]);
                        }
                    } else {
                        console.error("Failed to fetch styles:", response.status);
                    }
                } catch (error) {
                    console.error("Error fetching styles:", error);
                }
            };
    
            fetchStyles();
        }, []);

    return (
        <>
            <div className={styles.landingpage}>
                
                <div className={styles.navbar_container}>
                    <div className={styles.nav_left}>
                        <img src={Logo} alt="logoimg" />
                    </div>
                    <div className={styles.nav_right}>
                        <button className={styles.login_btn} onClick={() => navigate('/login')}>Login</button>
                        <button className={styles.signup_btn} onClick={() => navigate('/signup')}>Sign Up</button>
                    </div>
                </div>

                <div className={styles.bannersection_container}>
                    <div className={styles.leftbanner_container}>
                        <h1>Grow Your Business Faster with Hubly CRM</h1>
                        <p>Manage leads, automate workflows, and close deals effortlessly—all in one powerful platform.</p>
                        <div className={styles.button_container}>
                            <button className={styles.left_btn1}>Get started →</button>
                            <button className={styles.left_btn2}><img src={play} alt="playbtn" className={styles.playbtn} /> Watch Video</button>
                        </div>
                        
                    </div>
                    <div className={styles.rightbanner_container}>
                        <div className={styles.groupedImg}>
                            <img src={mainImg} alt="image" className={styles.main_image} />
                            <img src={topImg} alt="image" className={styles.top_image} />
                            <img src={bottomImg} alt="image" className={styles.bottom_image} />
                        </div>
                    </div>
                </div>

                {showChatbot && (
                    <div className={styles.chatmain_container}>
                        < Chat />
                    </div>
                )}


                <div className={styles.chatbtn_container}>
                    {showchat && (
                        <div className={styles.welcomeChat_container}>
                            <p className={styles.close} onClick={() => setShowchat(false)}>X</p>
                            <img src={ChatbtnImg} alt="chatimg" />
                            <p className={styles.chatbtn_text}>{chatbotStyles.welcomemessage}</p>
                        </div>
                    )}
                    <button className={styles.chatbtn} onClick={() => {
                        setShowChatbot(prev => !prev);
                        setShowchat(false);
                    }}><img src={ChartIcon} alt="chatbtnImg" /></button>
                </div>
                
                
                <div className={styles.companyList_container}>
                    <img src={cmp1} alt="cmplogo" />
                    <img src={cmp2} alt="cmplogo" />
                    <img src={cmp3} alt="cmplogo" />
                    <img src={cmp4} alt="cmplogo" />
                    <img src={cmp5} alt="cmplogo" />
                    <img src={cmp6} alt="cmplogo" />
                </div>

                <div className={styles.info_container}>
                    <div className={styles.topinfo_container}>
                        <h1>At its core, Hubly is a robust CRM solution.</h1>
                        <p>Hubly helps businesses streamline customer interactions, track leads, and automate tasks—saving you time and maximizing revenue. Whether you’re a startup or an enterprise, Hubly adapts to your needs, giving you the tools to scale efficiently.</p>
                    </div>
                    <div className={styles.bottominfo_container}>
                        <div className={styles.infoContent_container}>
                            <div className={styles.infoContent_section1}>
                                <h2>MULTIPLE PLATFORMS TOGETHER!</h2>
                                <p>Email communication is a breeze with our fully integrated, drag & drop email builder.</p>
                            </div>
                            <div className={styles.infoContent_section2}>
                                <h2>CLOSE</h2>
                                <p>Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
                            </div>
                            <div className={styles.infoContent_section3}>
                                <h2>NURTURE</h2>
                                <p>Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
                            </div>
                        </div>
                        <div className={styles.infoImg_container}>
                            <img src={infoImg1} alt="infoimg" className={styles.infoImg1} />
                            <img src={infoImg2} alt="infoimg" className={styles.infoImg2} />
                        </div>
                    </div>
                </div>

                <div className={styles.plan_container}>
                    <div className={styles.topPlan_container}>
                        <h1>We have plans for everyone!</h1>
                        <p>We started with a strong foundation, then simply built all of the sales and marketing tools ALL businesses need under one platform.</p>
                    </div>
                    <div className={styles.bottomPlan_container}>
                        <div className={styles.plan1_container}>
                            <h2>STARTER</h2>
                            <p>Best for local businesses needing to improve their online reputation.</p>
                            <h1>$199<span> /monthly</span></h1>
                            <h3>What's included</h3>
                            <ul>
                                <li><span>&#10003;</span>Unlimited Users</li>
                                <li><span>&#10003;</span>GMB Messaging</li>
                                <li><span>&#10003;</span>Reputation Management</li>
                                <li><span>&#10003;</span>GMB Call Tracking</li>
                                <li><span>&#10003;</span>24/7 Award Winning Support</li>
                            </ul>
                            <button className={styles.plan1Signup_btn}>SIGN UP FOR STARTER</button>
                        </div>
                        <div className={styles.plan2_container}>
                            <h2>GROW</h2>
                            <p>Best for all businesses that want to take full control of their marketing automation and track their leads, click to close.</p>
                            <h1>$399<span>/monthly</span></h1>
                            <h3>What's included</h3>
                            <ul>
                                <li><span>&#10003;</span>Pipeline Management</li>
                                <li><span>&#10003;</span>Marketing Automation Campaigns</li>
                                <li><span>&#10003;</span>Live Call Transfer</li>
                                <li><span>&#10003;</span>GMB Messaging</li>
                                <li><span>&#10003;</span>Embed-able Form Builder</li>
                                <li><span>&#10003;</span>Reputation Management</li>
                                <li><span>&#10003;</span>24/7 Award Winning Support</li>
                            </ul>
                            <button className={styles.plan2Signup_btn}>SIGN UP FOR STARTER</button>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerLogo_container}>
                        <img src={Logo} alt="cmpLogo" />
                    </div>
                    <div className={styles.productLinks}>
                        <h3>Product</h3>
                        <ul>
                            <li><a href="/">Universal checkout</a></li>
                            <li><a href="/">Payment workflows</a></li>
                            <li><a href="/">Observability</a></li>
                            <li><a href="/">UpliftAI</a></li>
                            <li><a href="/">Apps & integrations</a></li>
                        </ul>
                    </div>
                    <div className={styles.primerLinks}>
                        <h3>Why Primer</h3>
                        <ul>
                            <li><a href="/">Expand to new markets</a></li>
                            <li><a href="/">Boost payment success</a></li>
                            <li><a href="/">Improve conversion rates</a></li>
                            <li><a href="/">Reduce payments fraud</a></li>
                            <li><a href="/">Recover revenue</a></li>
                        </ul>
                    </div>
                    <div className={styles.developersLink}>
                        <h3>Developers</h3>
                        <ul>
                            <li><a href="/">Primer Docs</a></li>
                            <li><a href="/">API Reference</a></li>
                            <li><a href="/">Payment methods guide</a></li>
                            <li><a href="/">Service status</a></li>
                            <li><a href="/">Community</a></li>
                        </ul>
                    </div>
                    <div className={styles.resourcesLinks}>
                        <h3>Resources</h3>
                        <ul>
                            <li><a href="/">Blog</a></li>
                            <li><a href="/">Success stories</a></li>
                            <li><a href="/">News room</a></li>
                            <li><a href="/">Terms</a></li>
                            <li><a href="/">Privacy</a></li>
                        </ul>
                    </div>
                    <div className={styles.companyLinks}>
                        <h3>Company</h3>
                        <ul>
                            <li><a href="/">Careers</a></li>
                        </ul>
                    </div>
                    <div className={styles.socialLinks}>
                        <img src={SocialImg} alt="icons" />
                    </div>
                </div>

            </div>
        </>
    )
}

export default LandingPage

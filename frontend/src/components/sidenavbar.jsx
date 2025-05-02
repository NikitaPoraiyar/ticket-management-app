import React, { useState } from 'react'
import styles from '../styles/sidenavbar.module.css';
import Logo from '../assets/halfLogo.png';
import symbol1 from '../assets/symbol1.png';
import { GoHome } from "react-icons/go";
import symbol2 from '../assets/symbol2.png';
import { MdOutlineMessage } from "react-icons/md";
import symbol3 from '../assets/symbol3.png';
import symbol4 from '../assets/symbol4.png';
import symbol5 from '../assets/symbol5.png';
import symbol6 from '../assets/symbol6.png';
import { IoSettingsOutline } from "react-icons/io5";
import adminProfileImg from '../assets/default_admin.png';


function sidenavbar({setActivePage}) {
    const [activeindex, setActiveindex] = useState(0);

    const symbols = [
        { icon: <GoHome size={22} />, label: "Dashboard", class: styles.dashboard_btn },
        { icon: <MdOutlineMessage size={22} />, label: "Contact Center", class: styles.contact_btn },
        { icon: <img src={symbol3} alt="symbol_img" />, label: "Analytics", class: styles.analytics_btn },
        { icon: <img src={symbol4} alt="symbol_img" />, label: "Chat bot", class: styles.chatbot_btn },
        { icon: <img src={symbol5} alt="symbol_img" />, label: "Team", class: styles.team_btn },
        { icon: <IoSettingsOutline size={22} />, label: "Setting", class: styles.setting_btn },
    ];

    const handleClick = (index) => {
        setActiveindex(index);
        setActivePage(index);
    };

    return (
        <div className={styles.sidenavbar_container}>
            <div>
                <img src={Logo} alt="cmplogo" className={styles.sidenav_cmplogo} />
                <div className={styles.symbol_container}>
                    {symbols.map((item, index) => (
                        <div key={index} onClick={() => handleClick(index)}>
                            <span className={styles.sidenav_icons}>{item.icon}</span>
                            {activeindex === index && <p className={item.class}>{item.label}</p>}
                        </div>
                    ))}
                    
                </div>
                
            </div>
            <div className={styles.defaultadminimg_container}>
                    <img src={adminProfileImg} alt="admin_img" />
                </div>
            
        </div>
    )
}

export default sidenavbar

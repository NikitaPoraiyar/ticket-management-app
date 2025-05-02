import React, { useState } from 'react'
import styles from '../styles/adminpage.module.css';
import SideNav from '../components/sidenavbar.jsx';
import Dashboard from '../components/dashboardpage.jsx';
import ContactCenter from '../components/contactcenterpage.jsx';
import Analytics from '../components/analyticspage.jsx';
import ChatBot from '../components/chatbotpage.jsx';
import Team from '../components/teampage.jsx';
import Setting from '../components/settingpage.jsx';

function AdminPage() {
    const [activePage, setActivePage] = useState(0);

    const renderPages = () => {
        switch (activePage) {
            case 0:
                return <Dashboard />;
            case 1:
                return <ContactCenter />;
            case 2:
                return <Analytics />;
            case 3:
                return <ChatBot />;
            case 4:
                return <Team />;
            case 5:
                return <Setting />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className={styles.adminpage_container}>
            <div className={styles.adminpage_sidebarcontainer}>
                <SideNav setActivePage={setActivePage}/>
            </div>

            <div className={styles.adminpage_contentcontainer}>
                {renderPages()}
            </div>
            
        </div>
    )
}

export default AdminPage



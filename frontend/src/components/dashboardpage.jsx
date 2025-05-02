import React, { use, useState, useEffect } from 'react'
import styles from '../styles/dashboard.module.css';
import searchIcon from '../assets/searchimg.png';
import ticketIcon from '../assets/allticketicon.png';
import userImg from '../assets/userprofile_img.png';

function dashboard() {
    const [activeSelection, setActiveSelection] = useState('all');
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            fetch('http://localhost:3000/api/users/formsubmissions', {
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if(data.formsubmissions){
                    const formsubmissions = data.formsubmissions.map(submission =>({
                        id: submission._id,
                        name: submission.name,
                        message: submission.message.text,
                        email: submission.email,
                        createdAt: submission.createdAt,
                        responseStatus: submission.responseStatus,
                        responseTime: submission.responseTime
                    }));
                    setChats(formsubmissions);
                }
                else{
                    console.log("No form submissions found")
                }
                
            })
            .catch(error => console.error(error));
        }
    },[])

    const handleSelection = (Selection) =>{
        setActiveSelection(Selection);
    }

    const filteredChats = chats.filter(chat => {
        if(activeSelection === 'all'){
            return true;
        }else if(activeSelection === 'resolved'){
            return chat.responseStatus === 'Resolved';
        }else if(activeSelection === 'unresolved'){
            return chat.responseStatus === 'Unresolved' || !chat.responseStatus;
        }
        return false;
    })


    return (
        <div className={styles.dashboard_container}>
            <div className={styles.dashboardheader_container}>
                <h3>Dashboard</h3>

                <div className={styles.search_dashboardcontainer}>
                    <img src={searchIcon} alt="" />
                    <input type="text" placeholder="Search for ticket" />
                </div>

                <div className={styles.ticketnav_container}>
                    <div className={`${styles.allticket_selection} ${activeSelection === 'all' ? styles.selectednav : ''}`} onClick={() => handleSelection('all')} >
                        <img src={ticketIcon} alt="" />
                        <h5>All Tickets</h5>
                    </div>
                    <div className={`${styles.resolvedticket_selection} ${activeSelection === 'resolved' ? styles.selectednav : ''}`} onClick={() => handleSelection('resolved')}>
                        <h5>Resolved</h5>
                    </div>
                    <div className={`${styles.unresolvedticket_selection} ${activeSelection === 'unresolved' ? styles.selectednav : ''}`} onClick={() => handleSelection('unresolved')}>
                        <h5>Unresolved</h5>
                    </div>
                </div>
            </div>

                <div className={styles.ticketdisplay_container}>

                    {filteredChats.map((chat) => {
                        const formatTime = (time) =>{
                            const options = {hour: '2-digit', minute: '2-digit', hour12: true};
                            const date = new Date(time);
                            return date.toLocaleTimeString([], options);
                        }

                        const formatTicketNumber = (createdAt) => {
                            const date = new Date(createdAt);
                            const year = date.getFullYear();
                            const month = (`${date.getMonth() + 1}`).slice(-2);
                            const day = (`0${date.getDate()}`).slice(-2);
                            return `Ticket# ${year}-00${day}${month}`;
                        };
                        return(
                        <div className={styles.tickets} key={chat.id}>
                            <div className={styles.ticketdisplay_topcontainer}>
                                <div className={styles.ticket_content}>
                                    <div className={styles.ticketheader_content}>
                                        <div className={styles.ticketheader1}>
                                            <div className={styles.ticketcircle_color}></div>
                                            <h4>{formatTicketNumber(chat.createdAt)}</h4>
                                        </div>
                                        <div>
                                            <p>Posted at: {formatTime(chat.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className={styles.ticket_message}>
                                        <h3>{chat.message}</h3>
                                        <h4>10:00</h4>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className={styles.ticketperson_infocontainer}>
                                <div>
                                    <div className={styles.userprofile}>
                                        <div>
                                            <img src={userImg} alt="userprofile" />
                                        </div>
                                    </div>
                                    <div className={styles.userinfo_conatiner}>
                                        <h4>{chat.name}</h4>
                                        <p>+91-0000000000</p>
                                        <p>{chat.email}</p>
                                    </div>
                                </div>
                                <a href="/">Open ticket</a>
                            </div>
                        </div>
                    );
            })}

                    

                </div>
                    
            
            
        </div>
    )
}

export default dashboard

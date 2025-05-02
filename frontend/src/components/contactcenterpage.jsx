import React, { use, useEffect, useState } from 'react'
import styles from '../styles/contactcenter.module.css';
import userImg from '../assets/userprofile_img.png';
import { GoHome } from "react-icons/go";
import squarecontactIcon from '../assets/squarecontact_img.png';
import phoneIcon from '../assets/phone_img.png';
import emailIcon from '../assets/email_img.png';
import member1 from '../assets/member1_img.png';
import member2 from '../assets/member2_img.png';
import member3 from '../assets/member3_img.png';
import adminImg from '../assets/admin_img.png';
import ticketIcon from '../assets/ticketstatus_img.png';
import dropdown from '../assets/dropdownbtn.png';
import Sendbtn from '../assets/sendbtn2.png';



function contactcenterpage() {
    const [active, setActive] = useState(0);
    const [showteammatesDropdown, setShowteammatesDropdown] = useState(false);
    const[teammates, setTeammates] = useState([]);
    const [showticketstatus, setShowTicketStatus] = useState(false);
    const [user, setUser] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingTeammate, setPendingTeammate] = useState(null);
    const [showResolvedPopup, setShowResolvedPopup] = useState(false);
    const [resolvedStatus, setResolvedStatus] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [emptychats, setEmptyChats] = useState(false);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/api/users/contactcenter', {
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user); 
                    setSelectedAdmin(data.user);
                }
                else{
                    console.log("User not found")
                }
            })
            .catch(error => console.error(error));

            

            fetch('http://localhost:3000/api/users/teammates', {
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.teammates) {
                    
                    setTeammates(data.teammates); 
                }
                else{
                    console.log("Teammates not found")
                }
            })
            .catch(error => console.error(error));

            refreshChats();
        }
        
    }, [])

    const refreshChats = () => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:3000/api/users/formsubmissions', {
            method: 'GET',
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if(data.formsubmissions){
                const formsubmissions = data.formsubmissions.map(submission => ({
                    id: submission._id,
                    name: submission.name,
                    message: submission.message.text,
                    email: submission.email,
                    createdAt: submission.createdAt,
                    responseStatus: submission.responseStatus,
                    responseTime: submission.responseTime,
                    assignedTeammate: submission.assignedTeammate ,
                    responseText: submission.responseText
                }));
                setChats(formsubmissions);
            }
        })
        .catch(error => console.error(error));
    };
    
    const handleClickChat = (index) => {
        setActive(index);
        setShowteammatesDropdown(false);
        setShowConfirmation(false);
        setPendingTeammate(null);

    }

    const handleClickParticipants = () => {
        setShowteammatesDropdown(!showteammatesDropdown);
    }

    const handleCheckBeforeClickStatus = () => {
        const assignedName = chats[active]?.assignedTeammate?.name || user?.name;
        if(user && assignedName !== user.name){
            return;
        }
        setShowTicketStatus(prev => !prev)
    }

    const handleSelectTeammate = (index) =>{
        setPendingTeammate(teammates[index]);
        setShowConfirmation(true);
    }

    const handleConfirmTeammate = () => {
        if (!pendingTeammate || !chats[active]) return;

        const updatedChats = chats.map((chat, index) => 
        index === active ? { ...chat, assignedTeammate: pendingTeammate } : chat)

        setChats(updatedChats);
        setSelectedAdmin(pendingTeammate);
        setShowConfirmation(false);

        const token = localStorage.getItem('token');
        console.log("Sending teammate assignment:", {
            chatId: chats[active].id,
            teammateId: pendingTeammate._id,
            status: chats[active].responseStatus || 'Unresolved'
        });

        fetch(`http://localhost:3000/api/users/formsubmissions/${chats[active].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                assignedTeammateId: pendingTeammate._id,
                responseStatus: chats[active].responseStatus || 'Unresolved'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Teammate assigned successfully');
                refreshChats();

                const updatedChats = chats.map((chat, index) =>
                    index === active ? {
                        ...chat, 
                        assignedTeammate: pendingTeammate,
                    }: chat
                )
                setChats(updatedChats);
                setSelectedAdmin(pendingTeammate);
                setShowConfirmation(false);
                setPendingTeammate(null);
            } else {
                console.log('Failed to assign teammate');
            }
        })
        .catch(error => console.error(error));
    }

    const updateTicketStatus = (status) => {
        if(!chats[active]) return;

        const updatedChats = chats.map((chat, index) =>
            index === active ? { ...chat, responseStatus: status } : chat
        )
        setChats(updatedChats);
        setShowTicketStatus(false);

        const currentTeammateId = pendingTeammate?._id || chats[active].assignedTeammate?._id;

        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/users/formsubmissions/${chats[active].id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ assignedTeammateId: currentTeammateId, responseStatus: status })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                refreshChats();
                console.log('Ticket status updated successfully');
            } else {
                console.log('Failed to update ticket status');
            }
        })
        .catch(error => console.error(error));
    }

    const handleSelectTicketStatus = (status) => {
        if(status === "Resolved"){
            setShowResolvedPopup(true);
        }
        else{
            updateTicketStatus(status);
        }
    }

    const handleConfirmResolved = () => {
        updateTicketStatus("Resolved");
        setShowResolvedPopup(false);
        setResolvedStatus(true);
    }

    const handleCancelAssignment = () => {
        setShowConfirmation(false);
    };

    const handleSendResponse =() =>{
        if(!chats[active]) return;
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3000/api/users/formsubmissions/${chats[active].id}/response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ responseText: responseMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const updatedChats = chats.map((chat, index) =>
                    index === active ? { 
                        ...chat, 
                        responseText: responseMessage, 
                        ShowresponsePopup: true 
                    } : chat
                );
                setChats(updatedChats);
                setResponseMessage('');
                console.log("Sending:", responseMessage);
                console.log('Response sent successfully');
            } else {
                console.log('Failed to send response');
            }
        })
        .catch(error => console.error(error));
    }


    function dateFormat(dateString) {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month:"long" ,
            day:"numeric",
        })
    }

    function getTicketNumber(dateString){
        const date = new Date(dateString);
        const year = date.getFullYear(); 
        const day = String(date.getDate()).padStart(2, '0'); 
        const month = String(date.getMonth() + 1);
        return `Ticket#${year}-00${day}${month}`;
    }



    return (
        <div className={styles.contactcenter_container}>

            <div className={styles.contact_leftcontainer}>
                <div className={styles.chatlistcontainer_title}>
                    <h3>Contact Center</h3>
                </div>
                <div className={styles.chatslistcontainer_header}>
                    <h5 className={styles.chatslistcontainer_header5}>Chats</h5>
                </div>
                <div className={styles.chatslist_container}>
                    {chats.map((chat,index) => (
                        <div key={chat._id} className={styles.chatsbtn_container} onClick={() => handleClickChat(index)}>
                            {active === index && (
                                <div className={styles.afterclick_blueline}></div>
                            )}
                            <div className={active === index ? styles.clickedchatbtn_innercontainer : styles.chatsbtn_innercontainer}>
                                <div className={styles.chatsbtn_img}>
                                    <img src={userImg} alt="userimg" />
                                </div>
                                <div className={styles.chatsbtn_content}>
                                    <h5 className={styles.chatnumber}>{chat.name}</h5>
                                    <p>{chat.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {!chats[active] && (
                <div className={styles.empty_middlecontainer}>

                </div>
            )}
            { chats[active] && (
                    <div className={styles.contact_middlecontainer}>
                        <div className={styles.chatcontent_titlecontainer}>
                            <h4>{chats[active] ? getTicketNumber(chats[active].createdAt) : ''}</h4>
                            {/* <img src={homeimg} alt="" /> */}
                            <GoHome size={22}/>
                        </div>
                        <div className={styles.chatcontent_maincontainer}>
                            <div className={styles.dateline_container}>
                                <span className={styles.line}></span>
                                <span className={styles.date}>{chats[active] ? dateFormat(chats[active].createdAt) :''}</span>
                                <span className={styles.line}></span>
                            </div>
                            {(chats[active].responseStatus === "Resolved" ||  (chats[active].assignedTeammate && user && chats[active].assignedTeammate._id !== user._id)) && (
                                    <div className={styles.assignedtoteammate_msg}>
                                        {chats[active].responseStatus === "Resolved" && (
                                            <p>This chat has been resolved.</p>
                                        )}
                                        {chats[active].assignedTeammate && user && chats[active].assignedTeammate._id !== user._id && (
                                            <p>This chat is assigned to new team member. you no longer have access </p>
                                        )}
                                </div>
                            )}
                            {chats[active].responseStatus !== "Resolved" && (
                                (!chats[active].assignedTeammate || (user && chats[active].assignedTeammate._id === user._id)) && (
                                    <>
                                        <div className={styles.chatcontent_container}>
                                            <div>
                                                <img src={userImg} alt="userimg" />
                                            </div>
                                            <div>
                                                <p className={styles.chatnumber}>{chats[active].name}</p>
                                                <p>{chats[active].message}</p>
                                            </div>
                                        </div>

                                        {chats[active].responseText && (
                                            <div className={styles.responsecontent_container}>

                                                <div>
                                                    <p className={styles.responsename}>{user?.name}</p>
                                                    <p>{chats[active].responseText}</p>
                                                </div>
                                                <div>
                                                    <img src={adminImg} alt="adminimg" />
                                                </div>
                                            </div>
                                        )}
                                        <div className={styles.chatcontent_textarea}>
                                            <textarea name="" placeholder='Type here' value={responseMessage} onChange={(e) => setResponseMessage(e.target.value)}></textarea>
                                            <img src={Sendbtn} alt="" onClick={handleSendResponse} />
                                        </div>
                                    </>
                                )
                            )}
                            
                        </div>
                    </div>
                )}
            




            <div className={styles.contact_rightcontainer}>
                <div className={styles.rightcontainer_header}>
                    <img src={userImg} alt="userimg" />
                    <h5>Chat</h5>
                </div>
                <div className={styles.rightcontainer_details}>
                    <h5 className={styles.blueheader}>Details</h5>
                    <div className={styles.displaydetail}>
                        <img src={squarecontactIcon} alt="" />
                        <p>{user ? user.name : 'Loading...'}</p>
                    </div>
                    <div className={styles.displaydetail}>
                        <img src={phoneIcon} alt="" />
                        <p>+1(000)000-0000</p>
                    </div>
                    <div className={styles.displaydetail}>
                        <img src={emailIcon} alt="" />
                        <p>{user ? user.email : 'Loading...'}</p>
                    </div>
                </div>
                { chats[active] && (
                <div className={styles.rightcontainer_teammates}>
                    <h5 className={styles.blueheader}>Teammates</h5>
                    <div className={styles.display_teammates}>
                            <div className={styles.defaultadmin_container}>
                                <img src={adminImg} alt="" />
                                <span>{chats[active] ?.assignedTeammate ? chats[active].assignedTeammate.name: user?.name}</span>
                            </div>
                            
                            <div className={styles.dropdowmIcon} onClick={() => handleClickParticipants()}>
                                <img src={dropdown} alt="" />
                            </div>
                    </div>
                    
                    {showConfirmation && (
                        <div className={styles.confirmTeammate_container}>
                            <p>Chat would be assigned to Different team member</p>
                            <div className={styles.confirmTeammate_btn}>
                                <button onClick={handleCancelAssignment} className={styles.addteammate_cancelbtn}>Cancel</button>
                                <button onClick={handleConfirmTeammate} className={styles.addteammate_confirmbtn}>Confirm</button>
                            </div>
                        </div>
                    )}

                    {showteammatesDropdown && (
                        <div className={styles.selectadmin_container}>
                            {teammates.map((member, index) => (
                                <div className={styles.outereachmember_container} key={index}>
                                <div className={styles.eachmember_container}>
                                        <img src={adminImg} alt="" />
                                        <span onClick={() => handleSelectTeammate(index)}>{member.name}</span>
                                </div>
                                <hr />
                                </div>
                            ))}
                            
                            
                        </div>
                    )}
                    
                    
                    <div className={styles.ticketstatus}>
                        <div className={styles.displayticket_status}>
                            <img src={ticketIcon} alt="" />
                            <span>{chats[active]?.responseStatus && chats[active].responseStatus!=="pending" ? chats[active].responseStatus : "Ticket status"}</span>
                            <div className={styles.dropdowmIcon} onClick={() => handleCheckBeforeClickStatus()}>
                                <img src={dropdown} alt="" />
                            </div>
                        </div>
                        {showticketstatus &&(
                            <div className={styles.ticketstatus_options}>
                                <span onClick={()=> handleSelectTicketStatus("Resolved")}>Resolved</span>
                                <hr />
                                <span onClick={()=> handleSelectTicketStatus("Unresolved")}>Unresolved</span>
                            </div>
                        )}

                        {showResolvedPopup && (
                            <div className={styles.resolved_popup}>
                                <p>Chat will be closed</p>
                                <div>
                                    <button className={styles.resolvedpopup_cancelbtn} onClick={() => setShowResolvedPopup(false)}>Cancel</button>
                                    <button className={styles.resolvedpopup_confirmbtn} onClick={() => handleConfirmResolved()}>Confirm</button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
                )}
                
            </div>
        </div>
    )
}

export default contactcenterpage

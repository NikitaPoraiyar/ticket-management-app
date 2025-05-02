import React, { useEffect, useState } from 'react'
import styles from '../styles/team.module.css';
import profile1 from '../assets/admin_img.png';
import profile2 from '../assets/member1_img.png';
import profile3 from '../assets/member2_img.png';
import profile4 from '../assets/member3_img.png';
import { AiOutlineEdit } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import AddTeamMemberModal from '../components/AddMemberModal.jsx';


function TeamPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showdelete, setShowDelete] = useState(false);
    const [teammates, setTeammates] = useState([]);
    const [memberToDelete, setMemberToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('https://ticket-management-app.onrender.com/api/users/contactcenter', {
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user); 

                    return fetch('https://ticket-management-app.onrender.com/api/users/teammates', {
                        method: 'GET',
                        headers:{
                            'Authorization': `Bearer ${token}`
                        }
                    })
                }
                else{
                    console.log("User not found")
                }
            })
            .then(response => response ? response.json() : null)
            .then(data => {
                if (data.teammates) {
                    setTeammates(data.teammates); 
                }
                else{
                    console.log("Teammates not found")
                }
            })
            .catch(error => console.error(error));
        }
    }, []);

    const handleAddMember = (newMember) => {
        setTeammates((prevTeammates) => [...prevTeammates, newMember]);
    }

    const handleDeleteMember = (member) => {
        setMemberToDelete(member);
        setShowDelete(true)
    }

    const handleConfirmDelete = async () => {
        if (!memberToDelete) return;
    
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const res = await fetch(`https://ticket-management-app.onrender.com/api/users/deletemember/${memberToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                const responseData = await res.json(); 
                console.log(responseData);
                setTeammates(prev => prev.filter(t => t._id !== memberToDelete._id)); 
                setShowDelete(false);
                setMemberToDelete(null);
            } else {
                const errorData = await res.json();
                console.error("Deletion failed:", errorData.message);
                alert("Failed to delete member: " + errorData.message);
            }
        } catch (error) {
            console.error("Error deleting member:", error);
            alert("Failed to delete member");
        }
    }
    }

    return (
        <div className={styles.teampage_container}>
            <div className={styles.teamheader_container}>
                <h3>Team</h3>
            </div>
            <div className={styles.team_tablecontainer}>
                <hr />
                <div className={styles.teamtable_headercontainer}>
                    <div className={styles.image_headercontainer}>
                    </div>
                    <div className={styles.fname_headercontainer}>
                        <h4 className={styles.fname}>Full Name</h4>
                    </div>
                    <div className={styles.phone_headercontainer}>
                        <h4 className={styles.phone}>Phone</h4>
                    </div>
                    <div className={styles.email_headercontainer}>
                        <h4 className={styles.email}>Email</h4>
                    </div>
                    <div className={styles.role_headercontainer}>
                        <h4 className={styles.role}>role</h4>
                    </div>
                    
                </div>
                <hr />
                <div className={styles.teamtable_bodycontainer}>
                    
                    <div className={styles.teamtable_rowcontainer}>
                        <div className={styles.row_image}>
                            <img src={profile1} alt="admin_img" />
                        </div>
                        <p className={styles.row_name}>{user ? user.name:""}</p>
                        <p className={styles.row_phone}>+1(000) 000-0000</p>
                        <p className={styles.row_email}>{user ? user.email:""}</p>
                        <p className={styles.row_role}>Admin</p>
                        <div className={styles.row_icons}>
                            <i className={styles.row_editbtn}></i>
                            <i className={styles.row_deletebtn}></i>
                        </div>
                    </div>

                    {teammates.map((member) => (
                        <div key={member._id} className={styles.teamtable_rowcontainer}>
                            <div className={styles.row_image}>
                                <img src={profile2} alt="member_img" />
                            </div>
                            <p className={styles.row_name}>{member.name}</p>
                            <p className={styles.row_phone}>+1(000) 000-0000</p>
                            <p className={styles.row_email}>{member.email}</p>
                            <p className={styles.row_role}>{member.role}</p>
                            <div className={styles.row_icons}>
                                <i className={styles.row_editbtn}><AiOutlineEdit /></i>
                                <i className={styles.row_deletebtn} onClick={() => handleDeleteMember(member)} ><MdDeleteOutline /></i>
                            </div>
                        </div>
                    ))}
                        
                        

                    {showdelete && (
                        <div className={styles.confirmdelete_container}>
                            <div className={styles.confirmdelete_header}>
                                <p>This teammate will be deleted</p>
                            </div>
                            <div className={styles.confirmdelete_body}>
                                <button className={styles.canceldelete_btn} onClick={() => setShowDelete(false)}>Cancel</button>
                                <button className={styles.confirmdelete_btn} onClick={handleConfirmDelete}>Confirm</button>
                            </div>
                        </div>
                    )}
                    
                    
                </div>
                <div className={styles.addbtn_container}>
                    <button type="submit" onClick={() => setIsModalOpen(true)}>
                        <IoMdAddCircleOutline size={18} /> Add Team members
                    </button>
                    <AddTeamMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onMemberAdded={handleAddMember} />
                </div>
            </div>
            
            

            
        </div>
    )
}

export default TeamPage

import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/AddMemberModal.module.css';

function AddMemberModal({ isOpen, onClose, onMemberAdded }) {
    const modalRef = useRef();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "member"
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if(modalRef.current && !modalRef.current.contains(e.target)){
                onClose();
            }
        };

        if(isOpen){
            document.addEventListener('mousedown',handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to continue");
                return;
            }

            const res = await fetch(`http://localhost:3000/api/users/addmember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json();

            if(res.ok){
                // alert("Member added successfully");
                if(onMemberAdded && data.newMember){
                    onMemberAdded(data.newMember);
                }
                setFormData({
                    name: '',
                    email: '',
                    designation: 'member'
                })
                onClose();
            }else{
                alert("Failed to add member")
            }
        }
        catch(error){
            console.log(error);
            alert("Failed to add member")
        }
    }

    return (
        <div className={styles.modal_overlay}>
            <div className={styles.main_modal} ref={modalRef}>
                <h2>Add Team Members</h2>
                <p>Talk with colleagues in a group chat. Messages in this group are only visible to it's participants. New teammates may only be invited by the administrators.</p>
                <form className={styles.modal_form} onSubmit={handleSubmit}>
                    <label>
                        User name
                        <input type="text" placeholder='User name' onChange={(event) => setFormData((prev) => {
                            return{
                                ...prev,
                                name: event.target.value,
                            }
                        })} required />
                    </label>
                    <label>
                        Email ID
                        <input type="email" placeholder='Email ID' onChange={(event) => setFormData((prev) => {
                            return{
                                ...prev,
                                email: event.target.value,
                            }
                        })} required />
                    </label>
                    <label>
                        Designation
                        <select onChange={(event) => setFormData((prev) => {
                            return{
                                ...prev,
                                role: event.target.value,
                            }
                        })} required>   
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                        </select>
                    </label>
                    <div>
                        <button className={styles.cancelbtn} onClick={onClose}>Cancel</button>
                        <button className={styles.savebtn} type='submit'>Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMemberModal

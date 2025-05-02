import React, { useEffect, useState } from 'react'
import styles from '../styles/setting.module.css';

function settingpage() {
    const [user, setUser] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
                }
                else{
                    console.log("User not found")
                }
            })
            .catch(error => console.error(error));
        }
    },[])

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            alert("Passwords don't match!!");
            return;
        }

        const token = localStorage.getItem('token');
        if(!token) return;

        try{
            const response = await fetch('http://localhost:3000/api/users/updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ newPassword:password })
            });
            const result = await response.json();
            if (response.ok) {
                alert("Password updated successfully.");
                setPassword('');
                setConfirmPassword('');
            } else {
                alert("Failed to update password: " + result.message);
            }
        }
        catch(error){
            console.error('Update password error:', error.message, error.stack);
        }

    }

    return (
        <div className={styles.settingpage_container}>
            <div className={styles.settingpage_headercontainer}>
                <h3>Settings</h3>
            </div>
            <div className={styles.settingpage_editcontainer}>
                <div className={styles.editcontainer_header}>
                    <h5>Edit Profile</h5>
                </div>
                <div className={styles.editform_container}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.editfields_container}>
                            <div className={styles.editfield}>
                                <label>Name</label>
                                <input type="text" value={user? user.name: ''} />
                            </div>
                            <div className={styles.editfield}>
                                <label>Username</label>
                                <input type="text" value={user? user.username: ''} />
                            </div>
                            <div className={styles.editfield}>
                                <label>Email</label>
                                <input type="text" value={user? user.email: ''} />
                            </div>
                            <div  className={styles.editfield}>
                                <label>Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <div  className={styles.editfield}>
                                <label>Confirm Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                        </div>
                        <div className={styles.editform_btncontainer}>
                            <button type="submit">Save</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}

export default settingpage

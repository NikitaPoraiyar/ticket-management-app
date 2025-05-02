import React, { useState } from 'react';
import styles from '../styles/login.module.css';
import Logo from '../assets/logo.png';
import sidebanner from '../assets/sidebannerImg.png';
import { useNavigate } from 'react-router-dom';

function login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try{
                const res = await fetch(`http://localhost:3000/api/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();
                console.log(data);

                if(res.ok){
                    const token = data.token;
                    localStorage.setItem('token', token);

                    localStorage.setItem("isLoggedIn", 'true');

                    if (data.user) {
                        localStorage.setItem('userType', data.user.type);
                        localStorage.setItem('userRole', data.user.role);
                    }
                    alert("Login successful");
                    navigate('/admin');
                }else{ 
                    setError(data.message || "Login failed.");
                }
            }
            catch(error){
                console.error("Login error:", error);    
                setError("Connection error. Please check your internet connection and try again.");            
                alert("Login Failed")
            }
        }

    return (
        <div className={styles.login_container}>
            <div className={styles.leftLogin_container}>
                <div className={styles.navbar_container}>
                    <img src={Logo} alt="cmplogo" />
                </div>
                <div className={styles.content_container}>
                    <h2>Sign in to your Plexify</h2>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.txtfield}>
                            <label>Username</label>
                            <input value={formData.username} onChange={(e) => setFormData({
                                ...formData, username: e.target.value
                            })} type="text" required />
                        </div>
                        <div className={styles.txtfield}>
                            <label>Password</label>
                            <input value={formData.password} onChange={(e) => setFormData({
                                ...formData, password: e.target.value
                            })} type="password" required />
                        </div>
                        <button className={styles.loginbtn} type='submit' >Log in</button>
                        <p className={styles.switchacc_text}>Don't have an account? <a href='/signup'>Sign up</a></p>
                    </form>
                    <div className={styles.termConditions_link}>
                        <p>This site is protected by reCAPTCHA and the <a href="/">Google Privacy Policy</a> and <a href="/">Terms and Services</a> apply</p>
                    </div>
                </div>
            </div>
            <div className={styles.rightLogin_container}>
                <div className={styles.sidebanner_container}>
                    <img src={sidebanner} alt="sidebanner" />
                </div>
            </div>
            
            
        </div>
    )
}

export default login

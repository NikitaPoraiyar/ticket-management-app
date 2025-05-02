import React, { useState } from 'react'
import styles from '../styles/signup.module.css';
import Logo from '../assets/logo.png';
import sidebanner from '../assets/sidebannerImg.png';
import { useNavigate } from 'react-router-dom';


function signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(formData.password !== formData.confirmpassword){
            alert("Passwords don't match!")
            return;
        }
        
        try{
            const res = await fetch(`http://localhost:3000/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if(res.status === 200){
                alert("Registration successful")
                navigate('/login');
            }else{
                alert("Registration Failed")
            }
        }
        catch(error){
            console.log(error)
            alert("Registration Failed")
        }
    }

    return (
        <div className={styles.signup_container}>
            <div className={styles.leftSignup_container}>
                <div className={styles.nav_container}>
                    <img src={Logo} alt="cmplogo" />
                </div>
                <div className={styles.signupContent_container}>
                    <div className={styles.formheaderSignup}>
                        <h2>Create an account</h2>
                        <p><a href="/login">Sign in instead</a></p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.formfield}>
                            <label>Name</label>
                            <input onChange={(event) => setFormData((prev) => {
                                return{
                                    ...prev,
                                    name:event.target.value,
                                }
                            })} type="text" required/>
                        </div>
                        <div className={styles.formfield}>
                            <label>Username</label>
                            <input onChange={(event) => setFormData((prev) => {
                                return{
                                    ...prev,
                                    username:event.target.value,
                                }
                            })} type="text" required />
                        </div>
                        <div className={styles.formfield}>
                            <label>Email</label>
                            <input onChange={(event) => setFormData((prev) => {
                                return{
                                    ...prev,
                                    email:event.target.value,
                                }
                            })} type="email" autoComplete='new-email' required />
                        </div>
                        <div className={styles.formfield}>
                            <label>Password</label>
                            <input onChange={(event) => setFormData((prev) => {
                                return{
                                    ...prev,
                                    password:event.target.value,
                                }
                            })} type="password" autoComplete="new-password" required />
                        </div>
                        <div className={styles.formfield}>
                            <label>Confirm Password</label>
                            <input onChange={(event) => setFormData((prev) => {
                                return {
                                    ...prev,
                                    confirmpassword:event.target.value,
                                }
                            })} type="password" autoComplete="new-password" required /> 
                        </div>
                        <div className={styles.terms_textContainer}>
                            <input type="checkbox" required />
                            <p className={styles.terms_text}>By creating an account, I agree to our <a href="">Terms of use</a> and <a href="">Privacy Policy</a></p>
                        </div>
                        <button className={styles.signupbtn} type='submit' >Create an account</button>
                    </form>
                </div>
                <div className={styles.termConditions_link}>
                    <p>This site is protected by reCAPTCHA and the <a href="/">Google Privacy Policy</a> and <a href="/">Terms and Services</a> apply</p>
                </div>
            </div>
            <div className={styles.rightSignup_container}>
                <div className={styles.sidebanner_container}>
                    <img src={sidebanner} alt="sidebanner" />
                </div>
            </div>
            
        </div>
    )
}

export default signup

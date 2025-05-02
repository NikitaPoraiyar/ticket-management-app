import React, { useState, useEffect } from 'react'
import styles from '../styles/Chat.module.css';
import sendbtn from '../assets/Sendbtn.png';
import chatbotImg1 from '../assets/chatbot_header.png';
import chatbotImg2 from '../assets/chatbot_avatar.png';

function Chat() {
    const [chatformData, setChatformData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });

    const [sessionId, setSessionId] = useState(null);
    const [showform, setShowForm] = useState(false);
    const [showmessage, setShowMessage] = useState(false);
    const [messages, setMessages] = useState([]);

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

    


    const handleformSubmit = async (e) => {
        e.preventDefault();
        setShowForm(true);
        try{
            const res = await fetch(`https://ticket-management-app.onrender.com/api/chat/formSubmission`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: chatformData.name,
                    phone: chatformData.phone,
                    email: chatformData.email,
                    message: chatformData.message
                }),
            });
            if(res.status === 200){
                const { id } = await res.json();
                setSessionId(id);
                // alert("Form submitted successfully")
                // setMessages([chatformData.message]);
                setChatformData( prev => ({ ...prev, message: "" }));
            }
            else{
                alert("Form submission failed")
            }
        }catch(err){
            console.log(err)
        }
    }

    const handleSendMessage = async () => {
        if(!chatformData.message || !sessionId) return;
        
        try{
            const res = await fetch(`https://ticket-management-app.onrender.com/api/chat/formSubmission/${sessionId}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: {
                        text: chatformData.message,
                        timestamp: Date.now()
                    }
                }),
            })

            if(res.status === 200){
                setMessages(prev => [...prev, chatformData.message]);
                setChatformData({ ...chatformData, message: "" });
                setShowMessage(true);
                // alert("Message sent successfully");
            }
            
        }
        catch(err){
            console.log(err)
        }
    }

    return (
        <div className={styles.chatmain_container} style={{ backgroundColor: chatbotStyles.bodybgclr }}>
            <div className={styles.display_chatheader} style={{ backgroundColor: chatbotStyles.headerbgclr }}>
                <img src={chatbotImg1} alt="" />
                Hubly
            </div>
            <div className={`${styles.display_chatbody} ${showform ? styles.chatformVisible : ""}`}>
                <div className={styles.display_msgcontainer}>
                    <div>
                        <img src={chatbotImg2} alt="" />
                        <div className={styles.auto_txt1}>{chatbotStyles.message1}</div>
                    </div>
                    <div className={styles.auto_txt2}>{chatbotStyles.message2}</div>
                </div>
                { showmessage && (
                    <div className={styles.displaytyped_messagecontainer}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles.typed_msgcontainer1}>
                                <div className={styles.message_txt1}>{msg}</div>
                            </div>
                        ))}
                        
                    </div>
                )}
                    
                { !showform && (
                    <div className={styles.introductionform_chatcontainer}>
                        <h5>Introduction Yourself</h5>
                        <form onSubmit={handleformSubmit}>
                            <label>
                                Your name
                                <input type="text" placeholder="Your name" value={chatformData.name} onChange={e => setChatformData({
                                    ...chatformData,
                                    name: e.target.value
                                })} required />
                            </label>
                            <label>
                                Your phone
                                <input type="text" placeholder="Your Phone" value={chatformData.phone} onChange={e => setChatformData({
                                    ...chatformData,
                                    phone: e.target.value
                                })} required  />
                            </label>
                            <label>
                                Your Email
                                <input type="text" placeholder="example@gmail.com" value={chatformData.email} onChange={e => setChatformData({
                                    ...chatformData,
                                    email: e.target.value
                                })} required  />
                            </label>
                            <button type='submit'>Thank You!</button>
                        </form>
                    </div>
                ) }
                
            </div>
            <div  className={`${styles.textarea_chatcontainer} ${showform ? styles.chatformVisible : ""}`}>
                <input type='text' placeholder='Write a message' value={sessionId ? chatformData.message : ""} onChange={(e) => setChatformData({ ...chatformData, message: e.target.value })} disabled={!sessionId} />
                <img src={sendbtn} alt="" onClick={handleSendMessage} />
            </div>



        </div>
    )
}

export default Chat

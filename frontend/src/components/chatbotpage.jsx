import React, { useEffect, useState } from 'react';
import styles from '../styles/chatbot.module.css';
import sendbtn from '../assets/Sendbtn.png';
import chatbotImg1 from '../assets/chatbot_header.png';
import chatbotImg2 from '../assets/chatbot_avatar.png';
import editbtnImg from '../assets/editbtn.png';
import ChatbtnImg from '../assets/welcomeChatbotImg.png';




function chatbotpage() {
    const [headerColor, setHeaderColor] = useState("#33475B");
    const [bgColor, setBgColor] = useState("#EEEEEE")
    const [message1, setMessage1] = useState("How can I help you?");
    const [message2, setMessage2] = useState("Ask me anything!");
    const [welcomeMessage, setWelcomeMessage] = useState("👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.")
    const [missedChatTimer, setMissedChatTimer] = useState(60);
    const [styleId, setStyleId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    

    useEffect(() => {
        const fetchsavedstyles = async() => {
            try{
                setIsLoading(true);
                const response = await fetch('https://ticket-management-app.onrender.com/api/users/styles');
                const data = await response.json();

                if(response.ok && data.success && data.data && data.data.length > 0) {
                    const latestStyle = data.data[0];
                    setStyleId(latestStyle._id);
                    
                    setHeaderColor(latestStyle.headerbgclr || "#33475B");
                    setBgColor(latestStyle.bodybgclr || "#EEEEEE");
                    setMessage1(latestStyle.message1 || "How can I help you?");
                    setMessage2(latestStyle.message2 || "Ask me anything!");
                    setWelcomeMessage(latestStyle.welcomemessage || "👋 Want to chat about Hubly? I'm an chatbot here to help you find your way.");
                    setMissedChatTimer(latestStyle.missedchattime || 60);
                    
                }
                setIsLoading(false);
            }
            catch(error){
                console.error(error)
                setIsLoading(false);
            }
        };
        fetchsavedstyles();
    },[])

    const saveCustomizations = async () => {
        const customizationData = {
            headerColor,
            bgColor,
            message1,
            message2,
            welcomeMessage,
            missedChatTimer
        };
        try{
            let url = "https://ticket-management-app.onrender.com/api/users/styles";
            let method = "POST";

            if(styleId){
                url=`https://ticket-management-app.onrender.com/api/users/styles/${styleId}`;
                method = "PUT"
            }

            const response = await fetch(url,{
                method,
                headers:{
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(customizationData)
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Customization saved successfully!', data);
                
                if (!styleId && data.data && data.data._id) {
                    setStyleId(data.data._id);
                }
                
                
            } else {
                console.error(data.error || 'Error saving customization.');
                
                
            }

        }
        catch(error){
            console.error('Error saving customizations:', error);

            
        }
    };

    useEffect(() => {
        if(isLoading)return;

        const debounceTimer = setTimeout(() => {
            saveCustomizations();
        },1000);

        return () => clearTimeout(debounceTimer);
    }, [headerColor, bgColor, message1, message2, welcomeMessage, missedChatTimer, isLoading]);

    


    return (
        <div className={styles.chatbot_container}>
            <div className={styles.chatbotheader_container}>
                <h3>Chat Bot</h3>
            </div>
            <div className={styles.chatbot_maincontainer}>
                <div className={styles.leftchatbot_container}>
                    <div className={styles.display_mainchatbot} style={{ backgroundColor: bgColor }}>
                        <div className={styles.display_chatbotheader} style={{ backgroundColor: headerColor }}>
                            <img src={chatbotImg1} alt="" />
                            Hubly
                        </div>
                        <div className={styles.display_chatbotbody}>
                            <div className={styles.defaultdisplay_msgcontainer}>
                                <div>
                                    <img src={chatbotImg2} alt="" />
                                    <div className={styles.default_txt1}>{message1}</div>
                                </div>
                                <div className={styles.default_txt2}>{message2}</div>
                            </div>
                            

                            <div className={styles.introductionform_container}>
                                <h5>Introduction Yourself</h5>
                                <form>
                                    <label>
                                        Your name
                                        <input type="text" value="Your name" />
                                    </label>
                                    <label>
                                        Your phone
                                        <input type="text" value="Your Phone" />
                                    </label>
                                    <label>
                                        Your Email
                                        <input type="text" value="example@gmail.com" />
                                    </label>
                                    <button>Thank You!</button>
                                </form>
                            </div>
                        </div>
                        <div className={styles.textarea_container}>
                            <input placeholder='Write a message' />
                            <img src={sendbtn} alt="" />
                        </div>
                    </div>

                    <div className={styles.welcomeChat_container}>
                        <p className={styles.close}>X</p>
                        <img src={ChatbtnImg} alt="chatimg" />
                        <p className={styles.chatbtn_text}>{welcomeMessage}</p>
                    </div>
                    
                </div>

                <div className={styles.rightchatbot_container}>
                    <div className={styles.headercolorpicker}>
                        <h3>Header Color</h3>
                        <div className={styles.headercolor_display}>
                            <div>
                                <div className={styles.roundheader_color1} style={{ backgroundColor: "#FFFFFF" }} onClick={() => setHeaderColor("#ffff")}></div>
                                <div className={styles.roundheader_color2} style={{ backgroundColor: "#000000" }} onClick={() => setHeaderColor("#000000")}></div>
                                <div className={styles.roundheader_color3} style={{ backgroundColor: "#33475B" }} onClick={() => setHeaderColor("#33475B")}></div>
                            </div>
                            <div className={styles.header_pickedcolorcontainer}>
                                <div className={styles.header_pickedcolor} style={{ backgroundColor: headerColor }}></div>
                                <input type='text' className={styles.displayheader_pickedcolor} value={headerColor} onChange={(e) => setHeaderColor(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.bgcolorpicker}>
                        <h3>Custom Background Color</h3>
                        <div className={styles.bgcolor_display}>
                            <div>
                                <div className={styles.roundbg_color1} style={{ backgroundColor: "#FFFFFF" }} onClick={() => setBgColor("#FFFFFF")}></div>
                                <div className={styles.roundbg_color2} style={{ backgroundColor: "#000000" }} onClick={() => setBgColor("#000000")}></div>
                                <div className={styles.roundbg_color3} style={{ backgroundColor: "#FAFBFC" }} onClick={() => setBgColor("#FAFBFC")}></div>
                            </div>
                            <div className={styles.bg_pickedcolorcontainer}>
                                <div className={styles.bg_pickedcolor} style={{ backgroundColor: bgColor }}></div>
                                <input type='text' className={styles.displaybg_pickedcolor} value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                            </div>
                        </div>
                        
                    </div>
                    <div className={styles.customizeMessage_container}>
                        <h3>Customize Message</h3>
                        <div>
                            <input type="text" value={message1} onChange={(e) => setMessage1(e.target.value)} />
                            <img src={editbtnImg} alt="" />
                        </div>
                        <div>
                            <input type="text" value={message2} onChange={(e) => setMessage2(e.target.value)} />
                            <img src={editbtnImg} alt="" />
                        </div>
                    </div>

                    <div className={styles.introductionform_editcontainer}>
                        <h3>Introduction Form</h3>
                        <form>
                            <label>
                                Your name
                                <input type="text" value='Your name' />
                            </label>
                            <label>
                                Your Phone
                                <input type="text" value='+1 (000) 000-0000' />
                            </label>
                            <label>
                                Your Email
                                <input type="text" value='example@gmail.com' />
                            </label>
                            <button type="submit">Thank You!</button>
                        </form>
                    </div>
                    <div className={styles.welcomemessage_container}>
                        <h3>Welcome Message</h3>
                        <textarea value={welcomeMessage} onChange={(e) => setWelcomeMessage(e.target.value)} maxLength={75} />
                        <span className={styles.char_count}>{welcomeMessage.length}/75</span>
                        <img  className={styles.welcomemessage_editbtn} src={editbtnImg} alt="edit_penimg" />
                    </div>
                    <div className={styles.missedchat_timercontainer}>
                        <h3>Missed chat timer</h3>
                        <div className={styles.timer_container}>
                            <div className={styles.timer_row1}>
                                <span>12</span>
                                <span>09</span>
                                <span>59</span>
                            </div>
                            <div className={styles.timer_row2}>
                                <span>00</span>
                                <span>:</span>
                                <span>10</span>
                                <span>:</span>
                                <span>00</span>
                            </div>
                            <div className={styles.timer_row3}>
                                <span>01</span>
                                <span>11</span>
                                <span>01</span>
                            </div>
                        </div>
                        <button className={styles.timer_savebtn}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default chatbotpage

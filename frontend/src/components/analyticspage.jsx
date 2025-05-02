import React, { useEffect, useState } from 'react'
import styles from '../styles/analytics.module.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


const data = [
    { week: 'week1', chats: 13 },
    { week: 'week2', chats: 8 },
    { week: 'week3', chats: 14 },
    { week: 'week4', chats: 9 },
    { week: 'week5', chats: 5 },
    { week: 'week6', chats: 13 },
    { week: 'week7', chats: 4 },
    { week: 'week8', chats: 8 },
    { week: 'week9', chats: 17 },
    { week: 'week10', chats: 19 },
]

function analyticspage() {
    const [chats, setChats] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState(0);
    const [averageResponseTime, setAverageResponseTime] = useState(0);

    const resolvedtickets = resolvedTickets;
    const totaltickets = chats.length;
    const resolvedPercentage = totaltickets>0 ?Math.round((resolvedtickets / totaltickets)*100):0;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          fetch('http://localhost:3000/api/users/formsubmissions', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
            .then(response => response.json())
            .then(data => {
              if (data.formsubmissions) {
                const formsubmissions = data.formsubmissions.map(submission => {
                  const createdAt = new Date(submission.createdAt);
                  let timeDiff = null;
      
                  if (submission.responseTime) {
                    const responseTime = new Date(submission.responseTime);
                    timeDiff = responseTime - createdAt;
                  }
      
                  return {
                    id: submission._id,
                    name: submission.name,
                    message: submission.message.text,
                    email: submission.email,
                    createdAt: submission.createdAt,
                    responseStatus: submission.responseStatus,
                    responseTime: submission.responseTime,
                    timeDiff: timeDiff,
                    assignedTeammate: submission.assignedTeammate,
                    responseText: submission.responseText
                  };
                });
      
                setChats(formsubmissions);
      
                const resolvedSubmissions = formsubmissions.filter(sub => sub.responseStatus === 'Resolved' && sub.timeDiff !== null);
                const resolvedCount = resolvedSubmissions.length;
                setResolvedTickets(resolvedCount);
      
                const totalResponseTime = resolvedSubmissions.reduce((acc, curr) => acc + curr.timeDiff, 0);
      
                const average = resolvedCount > 0 ? Math.round(totalResponseTime / resolvedCount / 60000, 2) : 0;
                setAverageResponseTime(average);
      
                console.log("Total chats: ", formsubmissions.length);
                console.log("Resolved tickets: ", resolvedCount);
                console.log("Average response time (ms): ", average);
              } else {
                console.log("No form submissions found");
              }
            })
            .catch(error => console.error(error));
        }
      }, []);
      
    return (
        <div className={styles.analytics_container}>
            <div className={styles.analytics_headercontainer}>
                <h3>Analytics</h3>
            </div>
            
            <div className={styles.missedchats_container}>
                <h2>Missed Chats</h2>
                <ResponsiveContainer width='60%' height={250}>
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey='week' />
                        <YAxis />
                        <Tooltip contentStyle={{ backgroundColor: "black", borderRadius:'10px', border: 'none' }} labelStyle={{ display:'none' }} itemStyle={{ color: '#ffff' }} cursor={{ stroke: '#000', strokeDasharray: '3 3' }} formatter={(value) => [`${value}`, 'Chats']} />
                        <Line type="monotone" dataKey="chats" stroke="#00FF00" strokeWidth={4}  dot={{ stroke: '#000', strokeWidth: 2, fill: '#fff', r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.averagereplytime_container}>
                <div className={styles.left_avgtimecontainer}>
                    <h2>Average Reply time</h2>
                    <p>For highest customer satisfaction rates you should aim to reply to an incoming customer's message in 15 seconds or less. Quick responses will get you more conversations, help you earn customers trust and make more sales.</p>
                </div>
                <div className={styles.right_avgtimecontainer}>
                    <h2>{averageResponseTime} mins</h2>
                </div>
            </div>

            <div className={styles.resolvedtickets_container}>
                <div className={styles.left_resolvedticketscontainer}>
                    <h2>Resolved Tickets</h2>
                    <p>A callback system on a website, as well as proactive invitations, help to attract even more customers. A separate round button for ordering a call with a small animation helps to motivate more customers to make calls.</p>
                </div>
                <div className={styles.right_resolvedticketscontainer}>
                    <CircularProgressbar
                        value={resolvedPercentage}
                        text={`${resolvedPercentage}%`}
                        styles={buildStyles({
                        pathColor: "#00FF00",      
                        textColor: "#000",         
                        trailColor: "#f6f8fc",     
                        strokeLinecap: "round",
                        textSize: "18px"
                        })}
                    />
                </div>
            </div>

            <div className={styles.totalchats_container}>
                <div className={styles.left_totalchatscontainer}>
                    <h2>Total Chats</h2>
                    <p>This metric Shows the total number of chats for all Channels for the selected the selected period </p>
                </div>
                <div className={styles.right_totalchatscontainer}>
                    <h2>{totaltickets} Chats</h2>
                </div>
            </div>

        </div>
    )
}

export default analyticspage

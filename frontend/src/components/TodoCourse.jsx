import React, { useState, useEffect } from 'react';
import Loading from '@pages/Loading';
import Scheduler from '@forms/Scheduler';

function TodoCourse(){
    const [data, setData] = useState(null);
    const [dates, setDates] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [err, setErr] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "scheduler", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(await response.json());
                }
                const { schedule, total } = await response.json();
                if( schedule===null || schedule.semesterStart===null || schedule.semesterEnd===null ) {
                    setErr(<>
                        <div className="error">
                            Please set semester start and end dates.
                        </div>
                    </>)
                    setData(false)
                    setLoading(false)
                    return false;
                }
                    
                const { semesterStart, semesterEnd } = schedule
                // array to hold schedule dates
                // const sched = {}

                const dailyHours = Math.floor(total / 60) // minutes to hours
                const dailyMinutes = total % 60 // remaining minutes
                const weeklyHours = (total / 60) * 7 // weekly total hours

                const sched = {
                    dailyStudyTime: `${dailyHours} hours and ${dailyMinutes} minutes per day.`,
                    weeklyStudyTime: `${weeklyHours.toFixed(2)} hours per week.`
                }

                // for (let day = new Date(semesterStart.split("T")[0]).getTime(); day <= new Date(semesterEnd.split("T")[0]).getTime(); day += (7*86400000)) {
                    
                //     // time conversions
                //     const dailyHours = Math.floor(total / 60) // minutes to hours
                //     const dailyMinutes = total % 60 // remaining minutes
                //     const weeklyHours = (total / 60) * 7 // weekly total hours

                //     sched[day] = {
                //         dailyStudyTime: `${dailyHours} hours and ${dailyMinutes} minutes per day.`,
                //         weeklyStudyTime: `${weeklyHours.toFixed(2)} hours per week.`
                //     }
                // }
                setData(sched)
                setDates({
                    start: semesterStart,
                    end: semesterEnd
                })
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        }
        getData();
    }, []);

    if (loading) return <Loading/>;

    if (error) return <div className="error">Error: {error.message}</div>    

    // const mili = (7*86400000);
    // const today = new Date().getTime();
    // const bydate = (Math.floor(today / mili) * mili);

    return(
        <div id="course-todo">
            {err}
            <Scheduler {...dates}/>
            {data ? <div className="entry">
                <div className="options">
                    <span>{data.weeklyStudyTime}</span>
                    <span>{data.dailyStudyTime}</span>
                </div>
            </div> : <div className="empty_item"><a href="/courses/new">Add a course!</a></div>}
        </div>
    );
}

export default TodoCourse;
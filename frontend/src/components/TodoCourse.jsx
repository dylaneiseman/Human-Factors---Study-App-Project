import React, { useState, useEffect } from 'react';

function TodoCourse(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "courses", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setData(await response.json());
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        getData();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (data.length === 0) return <div><a href="/courses/new">Create your first course!</a></div>

    const dataView = []
    Array.isArray(data) ? 
        data.forEach(e=>{
            dataView.push(
                <li id={e._id}>
                    <a href={"/courses/" + e._id}>{e.courseName}</a>
                </li>
            )
        }) :
        dataView.push(<>
            <li>{data.courseName}</li>
            <li>{data.intensityRank}</li>
            <li>{data.minToStudy}</li>
        </>);

    return(
        <div id="course-todo">
            {dataView}
        </div>
    );
}

export default TodoCourse;
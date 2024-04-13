import React, { useState, useEffect } from 'react';

function TodoAssignments(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "assignments", {
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

    async function handleCompleted(data) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "assignments/" + data._id, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                },
                body: JSON.stringify({"completed": data.completed ? false : true})
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const dataView = []
    for(const e of data) {
        const today = new Date().toISOString()
        if (e.dueDate < today) continue;
        dataView.push(
            <div className="item" id={e._id}>
                <a className="item_title" href={"/assignments/" + e._id}>{e.assignmentTitle}</a>
                <span className="date">{new Date(e.dueDate).toDateString()}</span>
                <span className="completed"><input type="checkbox" id="completed" name="completed" defaultChecked={e.completed} onChange={()=>handleCompleted(e)}/></span>
            </div>
        )
    }

    if (dataView.length === 0) return <div className="empty_item"><a href="/assignments/new">Create your first assignment!</a></div>


    return(
        <div id="assignment-todo">
            {dataView}
        </div>
    );
}

export default TodoAssignments;
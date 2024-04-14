import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from "react-router-dom";

function EditFlashcardGroup(){
    const navigate = useNavigate();
    const id = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [flashcardGroup, setFlashcardGroup] = useState({
        id: "",
        groupName: "",
    });

    const handleChange = (e) => {
        setFlashcardGroup({
            ...flashcardGroup,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(id);
        console.log(formJson);
        try{
            await fetch(process.env.REACT_APP_API_URL+'flashcards/group/'+id.id, { 
                method: "put",
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            navigate("/flashcards")
        }catch(error){
            console.log(error);
        }
    }

    useEffect(() => {
        async function getFlashcard() {
            try {
                console.log(id)
                // need id.id in request because params is instantiated as an object for some reason
                const response = await fetch(process.env.REACT_APP_API_URL+"flashcards/group/"+id.id, {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                const json = await response.json()
                setFlashcardGroup({id: json["_id"], groupName: json["groupName"]});
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        getFlashcard();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    return(
        <form id = 'update-flashcard-group' method = 'put' onSubmit = {handleSubmit}>
            <input type = 'text' id = 'groupName' name = 'groupName' placeholder = 'Flashcard Group Name' value = {flashcardGroup.groupName} onChange = {handleChange}/>
            <input type="submit" value="Rename Flashcard Group" />
        </form>
    )
}

export default EditFlashcardGroup;
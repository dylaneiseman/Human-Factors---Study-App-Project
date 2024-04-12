import { useNavigate } from "react-router-dom";
function Logout() {
    const navigate = useNavigate()
    function handleClick() {
        localStorage.removeItem("authToken");
        navigate("/");
        window.location.reload();
    }

    return(
        <button className="logout" onClick={handleClick}>
            Logout
        </button>
    );
}

export default Logout;
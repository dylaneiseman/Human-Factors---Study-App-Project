import { useNavigate} from "react-router-dom";

function Back(){
    const history = useNavigate()
    return(
        <button id="back-btn" onClick={() => history(-1)}><i class="fa-solid fa-arrow-left-long"></i></button>
    )
}

export default Back;
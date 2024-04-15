import "@css/pages/NotFound.scss";
import Modal from "@components/Modal";

function NotFound(){
    return(
        <Modal className="not-found">
            404 Not Found
            <div className="entry">
                <div className="options">
                    <button><a href="/home">return to home</a></button>
                </div>
            </div>
        </Modal>
    )
}

export default NotFound;
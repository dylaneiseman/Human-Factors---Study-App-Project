import Modal from "@components/Modal";
import "@css/pages/Loading.scss";

function Loading() {
    return(
        <Modal className="loading-page">
            <div className="loader"></div>
        </Modal>
    )
}

export default Loading
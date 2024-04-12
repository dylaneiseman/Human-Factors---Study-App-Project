import "@css/components/Modal.scss";

function Modal(args){
    const {children} = args;

    return(
        <div className="modal">
            {children}
        </div>
    )
}

export default Modal;
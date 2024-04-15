import "@css/components/Modal.scss";

function Modal(args){
    const {children, className} = args;

    return(
        <div className={"modal " + className}>
            <div className="modal-inside">
                {children}
            </div>
        </div>
    )
}

export default Modal;
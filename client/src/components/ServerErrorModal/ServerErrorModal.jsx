import "./ServerErrorModal.scss";

import { useRef } from "react";

export default function ServerErrorModal({ show, setShow }) {
    const showModalButtonRef = useRef();

    if (show) showModalButtonRef.current.click();

    return (
        <>
            <div className="modal fade" id="errorModal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="modal-title">UNEXPECTED SERVER ERROR</span>
                        </div>
                        <div className="modal-body">
                            Something went wrong on the server. Contact us with a description of this trouble through support form.
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                class="btn btn-outline-danger"
                                data-bs-dismiss="modal"
                                onClick={(event) => setShow(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <button
                ref={showModalButtonRef}
                data-bs-toggle="modal"
                data-bs-target="#errorModal"
                hidden
            ></button>
        </>
    );
}
import "./Support.scss";
import { useLayoutEffect, useRef, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import axiosInstance from "../../instances/axios";

export function Support() {
    const textarea_elem = useRef(null);
    const [reportText, setReportText] = useState("");
    const [isAlertShow, setAlertShow] = useState(false);
    const [alertProperties, setAlertProperties] = useState({});

    const adjustHeight = () => {
        textarea_elem.current.style.height = `${textarea_elem.current.scrollHeight}px`;
    }
    
    const createReport = async () => {
        try {
            const { data } = await axiosInstance.post(
                "user_report",
                {text: reportText.trim()}
            )
            let userReportID = data.id;
            setAlertProperties({
                type: "success",
                title: "Success!",
                text: `Your report ID is ${userReportID}`
            });
        } catch (err) {
            const errorDetails = Object.entries(err?.response?.data || {}).map(
                ([fieldName, details]) => {
                    return `Field "${fieldName}": ${details.join(",").toLowerCase()}`
                }
            );

            setAlertProperties({
                type: "danger",
                title: "ERROR!!!",
                code: err.code,
                details: errorDetails.join(";") || err.message
            });
        }
        setAlertShow(true);
    }

    useLayoutEffect(adjustHeight, []);

    return (
        <>
            <div className="page__content container-fluid overflow-auto">
                <PageHeader></PageHeader>
                <div className="page__body d-flex flex-column row-gap-10">
                    <div className="display-1 text-center">
                        Support
                    </div>
                    <form className="d-flex flex-column row-gap-2">
                        { isAlertShow ?
                        <div
                            className={"w-50 mx-auto alert alert-" + alertProperties.type}
                            data-bs-theme="dark"
                        >
                            <div className="alert__header d-flex justify-content-between">
                                <div className="title fw-bold">{alertProperties.title}</div>
                                <button type="button" className="btn-close" onClick={() => setAlertShow(false)} />
                            </div>
                            <div className="alert__body">
                                { alertProperties.type === "success" ?
                                <> {alertProperties.text} </>
                                : alertProperties.type === "danger" ?
                                <>
                                    <div className="error__code">
                                        <span className="fw-bold">Code: </span>
                                        <span>{alertProperties.code}</span>
                                    </div>
                                    <div className="error__details">
                                        <span className="fw-bold">Details:</span>
                                        <div>{alertProperties.details}</div>
                                    </div>
                                </>
                                : null }
                            </div>
                        </div>
                        : null }
                        <div className="form-floating w-50 mx-auto">
                            <textarea
                                className="form-control shadow-none"
                                id="userReport"
                                placeholder=""
                                value={reportText}
                                onChange={adjustHeight}
                                onInput={(e) => {setReportText(e.target.value)}}
                                ref={textarea_elem}
                            ></textarea>
                            <label htmlFor="userReport">Describe the problem</label>
                        </div>
                        <div className="d-flex w-50 mx-auto float-start">
                            <button
                                type="submit"
                                className="btn btn-secondary rounded-pill"
                                onClick={(e) => {
                                    e.preventDefault()
                                    createReport()
                                }}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Support;
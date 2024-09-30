import "./Support.scss";
import { useLayoutEffect, useRef, useState } from "react";
import PageHeader from "../../components/PageHeader";
import axiosInstance from "../../instances/axios";

export function Support() {
    const textarea_elem = useRef(null);
    const [reportText, setReportText] = useState("");

    const adjustHeight = () => {
        textarea_elem.current.style.height = `${textarea_elem.current.scrollHeight}px`;
    }
    
    const createReport = async () => {
        try {
            const { data } = await axiosInstance.post(
                "user_report",
                {text: reportText.trim()}
            )
        } catch (err) {
            
        }
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
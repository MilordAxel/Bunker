import "./Support.scss";
import { useLayoutEffect, useRef } from "react";
import PageHeader from "../../components/PageHeader";

export function Support() {
    const textarea_elem = useRef(null);

    const adjustHeight = () => {
        textarea_elem.current.style.height = `${textarea_elem.current.scrollHeight}px`;
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
                                onChange={adjustHeight}
                                ref={textarea_elem}
                            ></textarea>
                            <label htmlFor="userReport">Describe the problem</label>
                        </div>
                        <div className="d-flex w-50 mx-auto float-start">
                            <button type="submit" className="btn btn-secondary rounded-pill">Send</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Support;
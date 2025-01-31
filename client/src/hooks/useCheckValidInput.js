import { useEffect } from "react";

export default function useCheckValidInput(inputsRefs, errorMessages) {
    useEffect(() => {
        (() => {
            for (let fieldName in inputsRefs.current) {
                if (inputsRefs.current[fieldName] === null) {
                    continue
                } else if (errorMessages[fieldName] !== undefined) {
                    inputsRefs.current[fieldName].classList.add("bad__input");
                } else {
                    inputsRefs.current[fieldName].classList.remove("bad__input");
                };
            }
        })();
    }, [errorMessages]);
}

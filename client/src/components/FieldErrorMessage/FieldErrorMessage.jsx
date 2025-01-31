import "./FieldErrorMessage.scss";

export default function ErrorMessage({ textList }) {
    return (
        <>
            <div className="error__message">
                { textList.map((row, index) => (
                    <span key={index}>{row}</span>
                )) }
            </div>
        </>
    );
}


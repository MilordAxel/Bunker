import "./NewGame.scss";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../instances/axios";
import PageHeader from "../../components/PageHeader/PageHeader";

function ErrorMessage({ textList }) {
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

function NewGame() {
    const inputsRefs = useRef({});

    const [gameName, setGameName] = useState("");
    const [nickname, setNickname] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [isPrivateGame, setPrivateGame] = useState(false);

    const [errorMessages, setErrorMessages] = useState({});

    const createGame = (event) => {
        event.preventDefault();
        axiosInstance.post(
            "/create_game",
            {
                gameName: gameName,
                gamePassword: gamePassword,
                privateGame: isPrivateGame,
                playerNickname: nickname
            }
        ).catch(
            (error) => {
                switch (error.status) {
                    case 400:
                        setErrorMessages(error.response.data);
                        break;
                    default:
                        setErrorMessages({});
                        break;
                }
            }
        );
    }

    useEffect(() => {
        function checkValidInput() {
            for (let fieldName in inputsRefs.current) {
                if (inputsRefs.current[fieldName] === null) {
                    continue
                } else if (errorMessages[fieldName] !== undefined) {
                    inputsRefs.current[fieldName].classList.add("bad__input");
                } else {
                    inputsRefs.current[fieldName].classList.remove("bad__input");
                };
            }
        }
        checkValidInput();
    }, [errorMessages]);

    return (
        <>
        <div className="page__content container-fluid overflow-auto">
            <PageHeader></PageHeader>
            <div className="page__body d-flex flex-column row-gap-10">
                <div className="display-1 text-center">
                    Create New Game
                </div>
                <form className="d-flex flex-column row-gap-4 w-25 mx-auto">
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="gameName"
                            placeholder=""
                            value={gameName}
                            onInput={(event) => setGameName(event.target.value)}
                            ref={(elem) => inputsRefs.current["gameName"] = elem}
                        />
                        <label htmlFor="gameName">Game name</label>
                        <ErrorMessage textList={errorMessages?.gameName || []} />
                    </div>

                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="nickname"
                            placeholder=""
                            value={nickname}
                            onInput={(event) => {setNickname(event.target.value)}}
                            ref={(elem) => inputsRefs.current["nickname"] = elem}
                        />
                        <label htmlFor="nickname">Enter your nickname</label>
                        <ErrorMessage textList={errorMessages?.nickname || []} />
                    </div>

                    { isPrivateGame ?
                    <>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control"
                                id="gamePassword"
                                placeholder=""
                                value={gamePassword}
                                onInput={(elem) => setGamePassword(elem.target.value)}
                                ref={(elem) => inputsRefs.current["gamePassword"] = elem}
                            />
                            <label htmlFor="gamePassword">Game password</label>
                            <ErrorMessage textList={errorMessages?.gamePassword || []} />
                        </div>
                    </>
                    :
                    null }
                    
                    <div className="d-flex justify-content-between">
                        <div className="form-check form-switch">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="privateGame"
                                checked={isPrivateGame}
                                onChange={()=>setPrivateGame(!isPrivateGame)}
                            />
                            <label htmlFor="privateGame" className="form-check-label">Private Game</label>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-secondary rounded-pill"
                            onClick={createGame}
                        >
                            Create Game
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default NewGame
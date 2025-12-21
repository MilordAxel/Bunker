import "./NewGame.scss";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../instances/axios";
import useCheckValidInput from "../../hooks/useCheckValidInput";

import PageHeader from "../../components/PageHeader/PageHeader";
import FieldErrorMessage from "../../components/FieldErrorMessage/FieldErrorMessage";
import ServerErrorModal from "../../components/ServerErrorModal/ServerErrorModal";

function NewGame() {
    const navigate = useNavigate();

    const inputsRefs = useRef({});

    const [gameName, setGameName] = useState("");
    const [nickname, setNickname] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [isPrivateGame, setPrivateGame] = useState(false);

    const [errorMessages, setErrorMessages] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);

    const createGame = (event) => {
        event.preventDefault();
        axiosInstance.post(
            "/game",
            {
                gameName: gameName,
                gamePassword: gamePassword,
                privateGame: isPrivateGame,
                playerNickname: nickname
            }
        ).then(
            (response) => {
                navigate(
                    `/game_waiting/${response.data.gameCode}`,
                    {
                        state: {
                            gameName: gameName,
                            playerID: response.data.playerID,
                            hostPlayerID: response.data.hostPlayerID
                        }
                    }
                );
            },
            (error) => {
                switch (error.status) {
                    case 400:
                        setErrorMessages(error.response.data);
                        break;
                    default:
                        setErrorMessages({});
                        setShowErrorModal(true);
                        break;
                }
            }
        );
    }

    useCheckValidInput(inputsRefs, errorMessages);

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
                        <FieldErrorMessage textList={errorMessages?.gameName || []} />
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
                        <FieldErrorMessage textList={errorMessages?.nickname || []} />
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
                                onInput={(event) => setGamePassword(event.target.value)}
                                ref={(elem) => inputsRefs.current["gamePassword"] = elem}
                            />
                            <label htmlFor="gamePassword">Game password</label>
                            <FieldErrorMessage textList={errorMessages?.gamePassword || []} />
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
            <ServerErrorModal show={showErrorModal} setShow={setShowErrorModal} />
        </div>
        </>
    );
}

export default NewGame
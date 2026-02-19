import "./JoinGame.scss";

import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../instances/axios";
import useCheckValidInput from "../../hooks/useCheckValidInput";

import PageHeader from "../../components/PageHeader/PageHeader";
import FieldErrorMessage from "../../components/FieldErrorMessage/FieldErrorMessage";
import ServerErrorModal from "../../components/ServerErrorModal/ServerErrorModal";
import NicknameModal from "../../components/NicknameModal/NicknameModal";
import PasswordModal from "../../components/PasswordModal/PasswordModal";

function JoinGame() {
    const navigate = useNavigate();

    const inputsRefs = useRef([]);

    const [gamesWaiting, setGamesWaiting] = useState(null);
    const [gameCode, setGameCode] = useState("");
    const [nickname, setNickname] = useState("");

    const [errorMessages, setErrorMessages] = useState({});
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const getDataFromModal = (data) => {
        if (data.nickname !== undefined)
            setNickname(data.nickname);
        if (data.showNicknameModal !== undefined)
            setShowNicknameModal(data.showNicknameModal);
        if (data.showPasswordModal !== undefined)
            setShowPasswordModal(data.showPasswordModal);
        if (data.showServerErrorModal !== undefined)
            setShowErrorModal(data.showServerErrorModal);
    }

    const addPlayerToGame = (event) => {
        event.preventDefault();

        axiosInstance.patch(
            "game/add_player",
            {
                gameCode: gameCode,
                playerNickname: nickname
            }
        ).then(
            (response) => {
                navigate(
                    `/game_waiting/${gameCode}`,
                    {
                        state: {
                            gameName: response.data.gameName,
                            playerID: response.data.playerID,
                            hostPlayerID: response.data.hostPlayerID
                        }
                    }
                );
            },
            (error) => {
                switch (error.status) {
                    case 400:
                        if (error.response.data.requiresPassword)
                            setShowPasswordModal(true);
                        else
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

    useEffect(() => {
        const socket = new WebSocket(
            import.meta.env.VITE_SERVER_WEBSOCKET_URL + "game_waiting_list"
        );

        socket.addEventListener(
            "message",
            (event) => {
                let response = JSON.parse(event.data);

                switch (response.dataType) {
                    case "init":
                        setGamesWaiting(() => response.gamesList);
                        break;
                    case "newGame":
                        setGamesWaiting((prevGamesWaiting) => {
                            console.log([ ...prevGamesWaiting, response.game]);
                            return [ ...prevGamesWaiting, response.game];
                        });
                        break;
                    case "deleteGame":
                        setGamesWaiting((prevGamesWaiting) => {
                            return prevGamesWaiting.filter(
                                (game) => game.code !== response.game.code
                            );
                        });
                        break;
                }
            }
        );

        socket.addEventListener(
            "error",
            (event) => socket.close()
        );

        socket.addEventListener(
            "close",
            (event) => {
                setGamesWaiting(null);
                if (event.code === 1011)
                    setShowErrorModal(true);
            }
        );

        return () => socket.close();
    }, []);

    useCheckValidInput(inputsRefs, errorMessages);

    return (
        <>
            <div className="page__content container-fluid overflow-auto">
                <PageHeader></PageHeader>
                <div className="page__body d-flex flex-column row-gap-10">
                    <div className="display-1 text-center">
                        Join Game
                    </div>
                    <div className="d-flex flex-row">
                        <div className="w-50 d-flex flex-column align-items-center row-gap-8">
                            <div className="display-6">List of the games</div>
                            { gamesWaiting ?
                            gamesWaiting.length ?
                            <div className="w-75 list-group">
                            { gamesWaiting.map((game) => (
                                <button
                                    key={game.code}
                                    type="button"
                                    className="list-group-item list-group-item-action"
                                    onClick={() => {
                                        setGameCode(game.code)
                                        setShowNicknameModal(true)
                                    }}
                                >
                                    {game.name}
                                </button>
                            )) }
                            </div>
                            :
                            <div className="text-center">
                                There are no available games
                            </div>
                            :
                            <div className="text-center">
                                Loading...
                            </div> }
                        </div>
                        <div className="w-75 d-flex flex-column align-items-center row-gap-8">
                            <div className="display-6">Join to the certain game</div>
                            <form className="w-50 d-flex flex-column row-gap-4">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="gameCode"
                                        placeholder=""
                                        onInput={(event) => setGameCode(event.target.value)}
                                        ref={(elem) => inputsRefs.current["gameCode"] = elem}
                                    />
                                    <label htmlFor="gameCode">Game Code</label>
                                    <FieldErrorMessage textList={errorMessages?.gameCode || []} />
                                </div>
                                
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nickname"
                                        placeholder=""
                                        onInput={(event) => setNickname(event.target.value)}
                                        ref={(elem) => inputsRefs.current["nickname"] = elem}
                                    />
                                    <label htmlFor="nickname">Nickname</label>
                                    <FieldErrorMessage textList={errorMessages?.nickname || []} />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-secondary rounded-pill align-self-end"
                                    onClick={addPlayerToGame}
                                >
                                    Join Game
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <ServerErrorModal
                    show={showErrorModal}
                    setShow={setShowErrorModal}
                ></ServerErrorModal>
                <NicknameModal
                    show={showNicknameModal}
                    gameCode={gameCode}
                    sendData={getDataFromModal}
                ></NicknameModal>
                <PasswordModal
                    show={showPasswordModal}
                    gameCode={gameCode}
                    nickname={nickname}
                    sendData={getDataFromModal}
                ></PasswordModal>
            </div>
        </>
    );
}

export default JoinGame;
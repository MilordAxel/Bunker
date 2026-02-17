import "./PasswordModal.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../instances/axios";
import useCheckValidInput from "../../hooks/useCheckValidInput";

import FieldErrorMessage from "../FieldErrorMessage/FieldErrorMessage";

export default function PasswordModal({show, gameCode, nickname, sendData}) {
    const inputsRefs = useRef({});
    const showModalButtonRef = useRef();
    const [gamePassword, setGamePassword] = useState("");
    const [errorMessages, setErrorMessages] = useState({});

    const navigate = useNavigate();

    const closeModal = () => {
        showModalButtonRef.current?.click();
    }

    useEffect(() => {
        if (show)
            closeModal();
    }, [show]);

    useCheckValidInput(inputsRefs, errorMessages);

    const joinToGame = (event) => {
        event.preventDefault();

        axiosInstance.patch(
            "game/add_player",
            {
                gameCode: gameCode,
                playerNickname: nickname,
                gamePassword: gamePassword
            }
        ).then(
            (response) => {
                closeModal();
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
            }
        ).catch(
            (error) => {
                switch (error.status) {
                    case 400:
                        setErrorMessages(error.response.data);
                        break;
                    default:
                        setErrorMessages({});
                        sendData(
                            {
                                showPasswordModal: true,
                                showServerErrorModal: true
                            }
                        );
                        break;
                }
            }
        );
    }

    return (
        <>
            <div className="modal fade" id="passwordModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content password">
                        <div className="modal-header">
                            <div className="h6">
                                Enter game password
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => sendData({ showPasswordModal: false })}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={joinToGame}>
                                <div>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="gamePassword"
                                        placeholder=""
                                        value={gamePassword}
                                        onInput={(event) => setGamePassword(event.target.value)}
                                        ref={(elem) => inputsRefs.current["gamePassword"] = elem}
                                    />
                                    <FieldErrorMessage textList={errorMessages?.gamePassword || []} />
                                    <button type="submit" className="btn btn-secondary mt-3 float-end">
                                        Join game
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <button
                ref={showModalButtonRef}
                data-bs-toggle="modal"
                data-bs-target="#passwordModal"
                onClick={() => sendData({ showPasswordModal: false })}
                hidden
            ></button>
        </>
    );
}
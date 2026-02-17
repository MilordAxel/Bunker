import "./NicknameModal.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../instances/axios";
import useCheckValidInput from "../../hooks/useCheckValidInput";

import FieldErrorMessage from "../FieldErrorMessage/FieldErrorMessage";

export default function NicknameModal({show, gameCode, sendData}) {
    const inputsRefs = useRef({});
    const showModalButtonRef = useRef();
    const [nickname, setNickname] = useState("");
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
                playerNickname: nickname
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
                        if (error.response.data?.requiresPassword) {
                            closeModal();
                            sendData(
                                {
                                    nickname: nickname,
                                    showPasswordModal: true
                                }
                            );
                        }
                        else
                            setErrorMessages(error.response.data);
                        break;
                    default:
                        setErrorMessages({});
                        sendData(
                            {
                                showNicknameModal: true,
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
            <div className="modal fade" id="nicknameModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content password">
                        <div className="modal-header">
                            <div className="h6">
                                Enter your nickname
                            </div>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={() => sendData({ showNicknameModal: false })}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={joinToGame}>
                                <div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nickname"
                                        placeholder=""
                                        value={nickname}
                                        onInput={(event) => setNickname(event.target.value)}
                                        ref={(elem) => inputsRefs.current["nickname"] = elem}
                                    />
                                    <FieldErrorMessage textList={errorMessages?.nickname || []} />
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
                data-bs-target="#nicknameModal"
                onClick={() => {sendData({ showNicknameModal: false }); }}
                hidden
            ></button>
        </>
    );
}
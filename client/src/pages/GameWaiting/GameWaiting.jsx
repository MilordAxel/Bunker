import "./GameWaiting.scss";

import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, useNavigation } from "react-router-dom";

import axiosInstance from "../../instances/axios";

import PageHeader from "../../components/PageHeader/PageHeader";
import ServerErrorModal from "../../components/ServerErrorModal/ServerErrorModal";


function GameWaiting() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    

    const [playerID, setPlayerID] = useState(location.state?.playerID);
    const [gamePlayers, setGamePlayers] = useState([]);
    const [hostPlayerID, setHostPlayerID] = useState(location.state?.hostPlayerID);
    const [gameName, setGameName] = useState(location.state?.gameName || "");
    const [showErrorModal, setShowErrorModal] = useState(false);

    const leaveGame = (event) => {
        axiosInstance.delete(
            "game/del_player",
            {
                data: {
                    gameCode: params.gameCode
                }
            }
        );
        navigate(-1);
    }

    const changeHost = (event) => {
        axiosInstance.patch(
            "game/change_host",
            {
                gameCode: params.gameCode,
                newHostPlayerID: event.target.dataset.playerId
            }
        ).then((response) => {
            if (response.data.status == "OK")
                setHostPlayerID(event.target.dataset.playerId);
        }).catch((error) => setShowErrorModal(true));
    }

    const kickPlayer = (event) => {
        axiosInstance.delete(
            "game/del_player",
            {
                data: {
                    gameCode: params.gameCode,
                    delOtherPlayer: true,
                    playerID: event.target.dataset.playerId
                }
            }
        ).catch((error) => setShowErrorModal(true));
    }

    useEffect(() => {
        const socket = new WebSocket(
            import.meta.env.VITE_SERVER_WEBSOCKET_URL + "game/players"
        );

        socket.addEventListener(
            "open",
            (event) => {
                socket.send(JSON.stringify({ gameCode: params.gameCode }));
            }
        );

        socket.addEventListener(
            "message",
            (event) => {
                let response = JSON.parse(event.data);

                if (response.status == "OK") {
                    if (response.dataType == "playersList")
                        setGamePlayers(response.playersList);
                    else if (response.dataType == "newPlayer")
                        setGamePlayers(
                            gamePlayers => [...gamePlayers, response.newPlayer]
                        );
                    else if (response.dataType == "delPlayer") {
                        if (playerID == response.playerID)
                            navigate(-1)
                        else
                            setGamePlayers(
                                gamePlayers => gamePlayers.filter((pl) => pl.id != response.playerID)
                            );
                    }
                    else if (response.dataType == "changeHost")
                        setHostPlayerID(response.hostPlayerID);
                }
                else if (response.status == "ERROR")
                    console.error(response.message);
            }
        )

        socket.addEventListener(
            "error",
            (event) => socket.close()
        );

        socket.addEventListener(
            "close",
            (event) => {
                socket.send(JSON.stringify({ gameCode: params.gameCode } ));
                if (event.code === 1011)
                    setShowErrorModal(true);
            }
        );

        return () => socket.close();
    }, []);

    return (
        <div className="page__content container-fluid overflow-auto">
            <PageHeader></PageHeader>
            <div className="page__body d-flex align-items-center flex-column row-gap-10">
                <div className="display-1">
                    Game Waiting
                </div>
                <div className="fs-4">
                    Game name: "{gameName}"
                </div>
                <div className="w-50 d-flex align-items-center flex-column row-gap-3">
                    <div className="fs-4 text-center">
                        Players
                    </div>
                    <ul className="w-75 list-group list-group-numbered">
                        { gamePlayers.map((pl) => (
                            <li key={pl.id} className="list-group-item d-flex align-items-center">
                                <span className="ms-1">
                                    {pl.nickname} {pl.id == hostPlayerID ? "(Host)" : ""}
                                </span>
                                { playerID == hostPlayerID && pl.id !== hostPlayerID ?
                                    <span className="ms-auto d-flex align-items-center">
                                        <button
                                            className="p-1 m-0 btn btn-outline-light"
                                            onClick={changeHost}
                                            data-player-id={pl.id}
                                        >
                                            Set Host
                                        </button>
                                        <button
                                            className="p-1 m-0 btn btn-outline-danger ms-2"
                                            onClick={kickPlayer}
                                            data-player-id={pl.id}
                                        >
                                            Kick
                                        </button>
                                    </span>
                                : null }
                            </li>
                        )) }
                    </ul>
                    <button className="btn btn-outline-danger" onClick={leaveGame}>
                        Leave Game
                    </button>
                </div>
            </div>
            <ServerErrorModal show={showErrorModal} setShow={setShowErrorModal} />
        </div>
    );
}

export default GameWaiting
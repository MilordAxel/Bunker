import "./NewGame.scss";
import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";

function NewGame() {
    const [gameName, setGameName] = useState("");
    const [nickname, setNickname] = useState("");
    const [gamePassword, setGamePassword] = useState("");
    const [isPrivateGame, setPrivateGame] = useState(false);

    return (
        <>
        <div className="page__content container-fluid overflow-auto">
            <PageHeader></PageHeader>
            <div className="page__body d-flex flex-column row-gap-10">
                <div className="display-1 text-center">
                    Create New Game
                </div>
                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="gameName"
                            placeholder=""
                            value={gameName}
                            onInput={(e) => setGameName(e.target.value)}
                        />
                        <label htmlFor="gameName">Game name</label>
                    </div>

                    <div className="form-floating">
                        <input
                            type="text"
                            className="form-control"
                            id="nickname"
                            placeholder=""
                            value={nickname}
                            onInput={(e) => {setNickname(e.target.value)}}
                        />
                        <label htmlFor="nickname">Enter your nickname</label>
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
                                onInput={(e) => setGamePassword(e.target.value)}
                            />
                            <label htmlFor="gamePassword">Game password</label>
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
                            onClick={(e) => {
                                e.preventDefault()

                            }}
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
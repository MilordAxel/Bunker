import "./NewGame.scss";
import { useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";

function NewGame() {
    const [nickname, setNickname] = useState("");
    const [isPrivateGame, setPrivateGame] = useState(false);

    return (
        <>
        <div className="page__content container-fluid overflow-auto">
            <PageHeader></PageHeader>
            <div className="page__body d-flex flex-column row-gap-10">
                <div className="display-1 text-center">
                    Create New Game
                </div>
                <form className="d-flex flex-column row-gap-2 w-25 mx-auto">
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
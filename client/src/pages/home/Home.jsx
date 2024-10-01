import "./Home.scss";
import imgBunker from "../../assets/img/bunker.jpg";
import PageHeader from "../../components/PageHeader/PageHeader";

export function Home() {
    return (
        <>
            <div className="page__content container-fluid overflow-auto">
                <PageHeader></PageHeader>
                <div className="page__body d-grid px-8 pt-4">
                    <div className="d-grid row-gap-10">
                        <div className="display-4 text-center">
                            Bunker
                        </div>
                        <div className="d-flex">
                            <div className="d-grid w-50">
                                <p>
                                    A global catastrophe is approaching the Earth. You are lucky, you are in front of the entrance to the rescue bunker, in which you can survive the most dangerous period and survive. But not everyone will be able to get into the bunker - only half of your company!
                                </p>
                                <p>
                                    Your goal is to convince other players that your skills and characteristics will be useful for survival in the apocalypse and that you should get into the bunker.
                                </p>
                                <p>
                                    Use this site to play "Bunker" do not leave home with friends
                                </p>
                            </div>
                            <div className="bunker__img d-flex w-50 text-center align-items-center">
                                <img className="d-block mx-auto" src={imgBunker} alt="bunker"/>
                            </div>
                        </div>
                    </div>
                    <div className="d-grid p-10 row-gap-4">
                        <div className="display-6 d-flex justify-content-center">
                            Creating new game room
                        </div>
                        <div className="d-flex justify-content-center gap-2">
                            <button type="button" className="btn btn-secondary rounded-pill">
                                Create new game
                            </button>
                            <button type="button" className="btn btn-secondary rounded-pill">
                                How to play?
                            </button>
                        </div>
                    </div>
                    <div className="d-grid justify-content-center row-gap-4">
                        <div className="display-6 d-flex justify-content-center">
                            New player?
                        </div>
                        <button type="button" className="btn btn-secondary rounded-pill">
                            Read game rules
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
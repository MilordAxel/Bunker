import "./App.css"

import {Routes, Route} from "react-router-dom"
import Home from "./pages/home/Home"
import Support from "./pages/support/Support"
import NewGame from "./pages/NewGame/NewGame"

function App() {
    return (
        <>
            <Routes>
                <Route element={<Home/>} path="/" />
                <Route element={<Support />} path="/support" />
                <Route element={<NewGame />} path="/new_game" />
                <Route element={<GameWaiting />} path="/game_waiting/:gameCode" />
            </Routes>
        </>
    )
}

export default App
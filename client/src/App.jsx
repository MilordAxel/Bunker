import "./App.css"

import {Routes, Route} from "react-router-dom"
import Home from "./pages/home/Home"
import Support from "./pages/support/Support"

function App() {
    return (
        <>
            <Routes>
                <Route element={<Home/>} path="/" />
                <Route element={<Support />} path="/support" />
            </Routes>
        </>
    )
}

export default App
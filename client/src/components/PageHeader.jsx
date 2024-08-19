import "./PageHeader.scss";
import { NavLink } from "react-router-dom";

export function PageHeader() {
    return (
        <nav className="page__header navbar navbar-expand sticky-top pb-0">
            <div className="nav nav-underline container-fluid px-4">
                <NavLink to="/" className="navbar-brand">Bunker</NavLink>
                <div className="navbar-nav">
                    <NavLink to="/new_game" className={({ isActive }) =>
                            [
                                "nav-link",
                                isActive ? "active" : ""
                            ].join(" ")
                        }
                    >
                        New game
                    </NavLink>
                    <NavLink to="/join_game" className={({ isActive }) =>
                            [
                                "nav-link",
                                isActive ? "active" : ""
                            ].join(" ")
                        }
                    >
                        Join game
                    </NavLink>
                    <NavLink to="/rules" className={({ isActive }) =>
                            [
                                "nav-link",
                                isActive ? "active" : ""
                            ].join(" ")
                        }
                    >
                        Game rules
                    </NavLink>
                    <NavLink to="/support" className={({ isActive }) =>
                            [
                                "nav-link",
                                isActive ? "active" : ""
                            ].join(" ")
                        }
                    >
                        Support
                    </NavLink>
                </div>
            </div>
        </nav>
    )
}

export default PageHeader
import { useState } from "react";
import "../styles/animation.css";
import "../styles/App.css";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Home from "./Home.js";
import Journals from "./Journals.js";
import Posts from "./Posts.js";
import SunAndMoon from "./SunMoon";

const routes = [
  {
    path: "/journals",
    name: "Journals",
    element: <Journals />,
  },
  { path: "/", name: "Home", element: <Home /> },
  {
    path: "/posts",
    name: "Posts",
    element: <Posts />,
  },
];

export default function AnimatedRoutes() {
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  function HandleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className={`container ${theme}`}>
      <div className="containerHeader">
        <div className="linkContainer">
          {routes.map((route) => (
            <Link key={route.path} to={route.path}>
              {route.name}
            </Link>
          ))}
        </div>
      </div>
      <SunAndMoon className="backChange" handleTheme={HandleTheme} />
      <div className="containerContent">
        <SwitchTransition>
          <CSSTransition
            key={location.pathname} // Use pathname to trigger the transition on URL change
            timeout={300} // Match the transition duration with your CSS
            classNames="page" // Use fade class names
            unmountOnExit // Ensure the element unmounts when exiting
          >
            <div className="fade-wrapper">
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/journals" element={<Journals />} />
              </Routes>
            </div>
          </CSSTransition>
        </SwitchTransition>{" "}
      </div>
    </div>
  );
}

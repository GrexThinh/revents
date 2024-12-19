import { Container } from "semantic-ui-react";
import NavBar from "./nav/NavBar";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../features/home/HomePage";
import ModalManager from "../common/modals/ModalManager";

function App() {
  const localtion = useLocation();

  return (
    <>
      {localtion.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <ModalManager />
          <NavBar />
          <Container className="main">
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default App;

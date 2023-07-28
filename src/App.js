import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import Pacientes from "./views/Pacientes";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import Menu from "./components/menu/Menu";

// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
initFontAwesome();

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();
  const [inactive, setInactive] = useState(false);


  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        { console.log(isAuthenticated)}
        { isAuthenticated ? (
        <Menu
        onCollapse={(inactive) => {
          //console.log(inactive);
          setInactive(inactive);
        }}
      />
        ): <NavBar /> }
        <Container className="flex-grow-1 mt-5">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" component={Profile} />
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/pacientes" component={Pacientes} />
          </Switch>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

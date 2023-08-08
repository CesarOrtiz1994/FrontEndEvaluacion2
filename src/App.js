import React, { useState } from "react";
import { Router, Route, Switch } from "react-router-dom";

import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Home from "./views/Home";
import Profile from "./views/Profile";
import ExternalApi from "./views/ExternalApi";
import Pacientes from "./views/Pacientes";
import { useAuth0 } from "@auth0/auth0-react";
import history from "./utils/history";
import Menu from "./components/menu/Menu";
import 'react-toastify/dist/ReactToastify.css';


// styles
import "./App.css";

// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Medicamentos from "./views/Medicamentos";
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
        { isAuthenticated ? (
        <Menu
        onCollapse={(inactive) => {
          setInactive(inactive);
        }}
      />
        ): <NavBar /> }
        <div className={`conter ${inactive ? "inactive" : ""}`}>
          <Switch>
            { isAuthenticated ? ( <Route path="/" exact component={Profile} /> ) : ( <Route path="/" exact component={Home} /> )}
            <Route path="/external-api" component={ExternalApi} />
            <Route path="/pacientes" component={Pacientes} />
            <Route path="/medicamentos" component={Medicamentos} />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;

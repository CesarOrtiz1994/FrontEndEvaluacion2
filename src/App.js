import React, { useState } from "react"
import { Router, Route } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import history from "./utils/history"
import "react-toastify/dist/ReactToastify.css"
// styles
import "./App.css"
//componentes
import NavBar from "./components/NavBar"
import Menu from "./components/menu/Menu"
import Loading from "./components/Loading"
//vistas
import Pacientes from "./views/Pacientes"
import Profile from "./views/Profile"
import ExternalApi from "./views/ExternalApi"
import Home from "./views/Home"
import Citas from "./views/Citas"
// fontawesome
import initFontAwesome from "./utils/initFontAwesome";
import Medicamentos from "./views/Medicamentos";
initFontAwesome();

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0()
  const [inactive, setInactive] = useState(false)
  const { getAccessTokenSilently } = useAuth0()

  //Alex: Console log de token
  if (isAuthenticated) {
    ;(async () => {
      const token = await getAccessTokenSilently()
      console.log("Token: ", token)
    })()
  }

  if (error) {
    return <div>Oops... {error.message}</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Router history={history}>
      <div
        id="app"
        className="d-flex flex-column h-100"
      >
        {isAuthenticated ? (
          <Menu
            onCollapse={(inactive) => {
              setInactive(inactive)
            }}
          />
        ) : (
          <NavBar />
        )}
        <div className={`conter ${inactive ? "inactive" : ""}`}>
          {/* <Switch> */}
          {isAuthenticated ? (
            <Route
              path="/"
              exact
              component={Profile}
            />
          ) : (
            <Route
              path="/"
              exact
              component={Home}
            />
          )}
          <Route
            path="/external-api"
            component={ExternalApi}
          />
          <Route
            path="/pacientes"
            component={Pacientes}
          />
          <Route
            path="/citas"
            component={Citas}
          />
          <Route path="/medicamentos" component={Medicamentos} />
          <Route path="/profile" component={Profile} />
            <Route path="/home" component={Home} />
          {/* </Switch> */}
        </div>
      </div>
    </Router>
  )
}

export default App
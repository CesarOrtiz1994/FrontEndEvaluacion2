import React, { useState } from "react"
import { Router, Route, Switch } from "react-router-dom"

import Loading from "./components/Loading"
import NavBar from "./components/NavBar"
import ExternalApi from "./views/ExternalApi"
import { useAuth0 } from "@auth0/auth0-react"
import history from "./utils/history"

import Menu from "./components/menu/Menu"

import Profile from "./views/Profile"
import Home from "./views/Home"
import Pacientes from "./views/Pacientes"
import Citas from "./views/Citas"

// styles
import "./App.css"

// fontawesome
import initFontAwesome from "./utils/initFontAwesome"
initFontAwesome()

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
        {console.log(isAuthenticated)}
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
          {/* </Switch> */}
        </div>
      </div>
    </Router>
  )
}

export default App

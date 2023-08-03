import React, { useState, useEffect } from "react"
import Highlight from "../components/Highlight"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { getConfig } from "../config"
import Loading from "../components/Loading"
import { Alert, Button } from "reactstrap"
import { AiOutlineUserAdd } from "react-icons/ai"

export const PacientesApiComponent = () => {
  const { apiOrigin = "http://localhost:3010", audience } = getConfig()

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  })

  const [citas, setCitas] = useState({
    showResult: false,
    apiResponse: "",
    error: null,
  })

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0()

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup()
      setState({
        ...state,
        error: null,
      })
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      })
    }
    await callApi()
  }

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup()
      setState({
        ...state,
        error: null,
      })
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      })
    }

    await callApi()
  }

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently()
      console.log(token)

      const response = await fetch(`${apiOrigin}/api/private`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      })
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      })
    }
  }

  const getCitas = async () => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${apiOrigin}/api/citas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const responseData = await response.json()
      setCitas({
        ...citas,
        showResult: true,
        apiResponse: responseData,
      })
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      })
    }
  }

  useEffect(() => {
    getCitas()
    console.log(citas.apiResponse)
  }, [])

  const handle = (e, fn) => {
    e.preventDefault()
    fn()
  }

  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        <div className="d-flex justify-content-between">
          <h1>Pacientes</h1>
          <button
            className="btn btn-outline-success fs-5 mb-2"
            // onClick={handleShowNuevo}
          >
            <AiOutlineUserAdd /> Nuevo Paciente
          </button>
        </div>

        <div className="divhr"></div>
        <br />

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Paciente`</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          {/* {console.log(pacientes.apiResponse)} */}

          <tbody>
            {citas.apiResponse.length > 0 &&
              citas.apiResponse.map((cita) => (
                <tr key={cita._id}>
                  <td>{cita.paciente}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger me-2"
                      // onClick={() => deleteUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      // onClick={() => handleShowEdit(usuario.id)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="result-block-container">
        {state.showResult && (
          <div
            className="result-block"
            data-testid="api-result"
          >
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
            <Button
              color="primary"
              className="mt-5"
              onClick={(e) =>
                setState({
                  ...state,
                  showResult: false,
                })
              }
              disabled={!audience}
            >
              ocultar
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default withAuthenticationRequired(PacientesApiComponent, {
  onRedirecting: () => <Loading />,
})

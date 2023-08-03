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

  const [pacientes, setPacientes] = useState({
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

    // await callApi()
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

    // await callApi()
  }

  // const callApi = async () => {
  //   try {
  //     const token = await getAccessTokenSilently()
  //     console.log(token)

  //     const response = await fetch(`${apiOrigin}/api/private`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })

  //     const responseData = await response.json()

  //     setState({
  //       ...state,
  //       showResult: true,
  //       apiMessage: responseData,
  //     })
  //   } catch (error) {
  //     setState({
  //       ...state,
  //       error: error.error,
  //     })
  //   }
  // }

  const getPacientes = async () => {
    try {
      const token = await getAccessTokenSilently()
      const response = await fetch(`${apiOrigin}/api/pacientes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const responseData = await response.json()
      setPacientes({
        ...pacientes,
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
    getPacientes()
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
              <th scope="col">Nombre</th>
              <th scope="col">Edad</th>
              <th scope="col">Tipo de sangre</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          {/* {console.log(pacientes.apiResponse)} */}

          <tbody>
            {pacientes.apiResponse.length > 0 &&
              pacientes.apiResponse.map((pacientes) => (
                <tr key={pacientes._id}>
                  <td>{pacientes.name}</td>
                  <td>{pacientes.edad}</td>
                  <td>{pacientes.sangre}</td>
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

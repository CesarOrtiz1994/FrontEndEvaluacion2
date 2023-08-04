import React, { useState, useEffect } from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { getConfig } from "../config"
import Loading from "../components/Loading"
import { Alert } from "reactstrap"
import { AiOutlineUserAdd } from "react-icons/ai"

import ModalEditar from "../components/citas/ModalEditar"
import ModalNew from "../components/citas/ModalNew"
import { ToastContainer } from "react-toastify"

export const Citas = () => {
  const { apiOrigin = "http://localhost:3010" } = getConfig()

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

  const [showNuevo, setShowNuevo] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [id, setId] = useState(0)

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0()

  const handleClose = () => {
    setShowNuevo(false)
    setShowEdit(false)
    getCitas()
  }

  const handleShowNuevo = () => {
    setShowNuevo(true)
  }

  const handleShowEdit = (id) => {
    setShowEdit(true)
    setId(id)
  }

  useEffect(() => {
    getCitas()
  }, [])

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

  const handle = (e, fn) => {
    e.preventDefault()
    fn()
  }

  return (
    <>
      <ToastContainer />
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
          <h1>Citas</h1>
          <button
            className="btn btn-outline-success fs-5 mb-2"
            onClick={handleShowNuevo}
          >
            <AiOutlineUserAdd /> Agendar cita
          </button>
        </div>

        <div className="divhr"></div>
        <br />

        {citas.apiResponse && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Paciente</th>
                <th scope="col">Fecha</th>
                <th scope="col">Hora</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.apiResponse.map((cita) => (
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
                      onClick={() => handleShowEdit(cita._id)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ModalNew
        show={showNuevo}
        handleClose={handleClose}
      />
      <ModalEditar
        show={showEdit}
        handleClose={handleClose}
        id_paciente={id}
      />
    </>
  )
}

export default withAuthenticationRequired(Citas, {
  onRedirecting: () => <Loading />,
})

import React, { useState, useEffect } from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { getConfig } from "../config"
import Loading from "../components/Loading"
import { Alert } from "reactstrap"
import { AiOutlineUserAdd } from "react-icons/ai"

// import ModalEditar from "../components/citas/ModalEditar"
import ModalNew from "../components/citas/ModalNew"
import ModalDetails from "../components/citas/ModalDetails"
import ModalEliminar from "../components/citas/ModalEliminar"
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
  // const [showEdit, setShowEdit] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [citaDetails, setCitaDetails] = useState(null)

  const {
    getAccessTokenSilently,
    loginWithPopup,
    getAccessTokenWithPopup,
    user,
  } = useAuth0()

  const handleClose = () => {
    setShowNuevo(false)
    // setShowEdit(false)
    setShowDetails(false)
    setShowDelete(false)
    getCitas()
  }

  const handleShowNuevo = () => {
    setShowNuevo(true)
  }

  // const handleShowEdit = (cita) => {
  // setShowEdit(true)
  // setCitaDetails(cita)
  // }

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
  }

  function toggleDetails(cita) {
    setCitaDetails(cita)
    setShowDetails(true)
  }

  function toggleDelete(cita_id) {
    setCitaDetails(cita_id)
    setShowDelete(true)
  }

  const getCitas = async () => {
    try {
      const token = await getAccessTokenSilently()
      const idDoctor = user.sub.split("|")[1]
      console.log(idDoctor)
      const response = await fetch(
        `${apiOrigin}/api/citas?idDoctor=${idDoctor}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
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
                  <td>{cita.paciente.name}</td>
                  <td>{cita.fecha}</td>
                  <td>{cita.hora}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={() => toggleDelete(cita._id)}
                    >
                      Eliminar
                    </button>
                    {/* <button
                      className="btn btn-outline-warning"
                      onClick={() => handleShowEdit(cita)}
                    >
                      Editar
                    </button> */}
                    <button
                      className="btn btn-outline-info ms-2"
                      onClick={() => toggleDetails(cita)}
                    >
                      Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {showNuevo && (
        <ModalNew
          show={showNuevo}
          handleClose={handleClose}
        />
      )}
      {/* {showEdit && (
        <ModalEditar
          show={showEdit}
          handleClose={handleClose}
          citaDetails={citaDetails}
        />
      )} */}
      {showDetails && (
        <ModalDetails
          show={showDetails}
          handleClose={handleClose}
          citaDetails={citaDetails}
        />
      )}
      {showDelete && (
        <ModalEliminar
          show={showDelete}
          handleClose={handleClose}
          citaId={citaDetails}
        />
      )}
    </>
  )
}

export default withAuthenticationRequired(Citas, {
  onRedirecting: () => <Loading />,
})

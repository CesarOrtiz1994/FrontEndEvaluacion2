import React, { useState, useEffect } from "react"
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { getConfig } from "../config"
import Loading from "../components/Loading"
import { Alert } from "reactstrap"
import { AiOutlineUserAdd } from "react-icons/ai"

import ModalEditPacientes from "../components/Pacientes/ModalEditPacientes"
import ModalNewPaciente from "../components/Pacientes/ModalNewPacientes"
import ModalEliminar from "../components/Pacientes/ModalEliminar"
import { ToastContainer } from "react-toastify"

export const PacientesApiComponent = () => {
  const { apiOrigin = "http://localhost:3010" } = getConfig()

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

  const [showNuevo, setShowNuevo] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const [id, setId] = useState(0)

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup, user } =
    useAuth0()

  

  const handleClose = () => {
    setShowNuevo(false)
    setShowEdit(false)
    setShowDelete(false)
    getPacientes()
  }

  const handleShowNuevo = () => {
    setShowNuevo(true)
  }

  const handleShowEdit = (id) => {
    setShowEdit(true)
    setId(id)
  }

  const handleShowDelete = (id) => {
    setShowDelete(true)
    setId(id)
  }

  useEffect(() => {
    getPacientes()
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

  const getPacientes = async () => {
    try {
      const token = await getAccessTokenSilently()
      const idDoctor = user.sub.split("|")[1]
      const response = await fetch(`${apiOrigin}/api/pacientes`, {
        method: "POST",
        body: JSON.stringify({
          idDoctor: idDoctor
        }),
        headers: {
          'Content-Type': 'application/json',
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
          <h1>Pacientes</h1>
          <button
            className="btn btn-outline-success fs-5 mb-2"
            onClick={handleShowNuevo}
          >
            <AiOutlineUserAdd /> Nuevo Paciente
          </button>
        </div>

        <div className="divhr"></div>
        <br />

        {pacientes.apiResponse && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Edad</th>
                <th scope="col">Tipo de sangre</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.apiResponse.map((pacientes) => (
                <tr key={pacientes._id}>
                  <td>{pacientes.name}</td>
                  <td>{pacientes.edad}</td>
                  <td>{pacientes.sangre}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={() => handleShowDelete(pacientes._id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => handleShowEdit(pacientes._id)}
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

      <ModalNewPaciente
        show={showNuevo}
        handleClose={handleClose}
      />
      <ModalEditPacientes
        show={showEdit}
        handleClose={handleClose}
        id_paciente={id}
      />
      <ModalEliminar
        show={showDelete}
        handleClose={handleClose}
        id_paciente={id}
      />

    </>
  )
}

export default withAuthenticationRequired(PacientesApiComponent, {
  onRedirecting: () => <Loading />,
})

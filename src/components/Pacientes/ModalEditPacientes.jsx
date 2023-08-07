import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

export default function ModalEditPacientes({ show, handleClose, id_paciente }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()
  const [nombre, setNombre] = useState("")
  const [edad, setEdad] = useState("")
  const [tipoSangre, setTipoSangre] = useState("")
  const { getAccessTokenSilently } = useAuth0()

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  })

  const [paciente, setPaciente] = useState({
    showResult: false,
    apiResponse: "",
    error: null,
  })

  useEffect(() => {
    if (id_paciente !== 0) {
      const getPaciente = async () => {
        try {
          const token = await getAccessTokenSilently()

          const response = await fetch(
            `${apiOrigin}/api/paciente/${id_paciente}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const responseData = await response.json()
          if (responseData) {
            setNombre(responseData.name)
            setEdad(responseData.edad)
            setTipoSangre(responseData.sangre)
          }
        } catch (error) {
          setState({
            ...state,
            error: error.error,
          })
        }
      }

      getPaciente()
    }
  }, [id_paciente])

  const edit = async (e) => {
    e.preventDefault()
    if (validate()) {
      const token = await getAccessTokenSilently()

      const response = await fetch(`${apiOrigin}/api/paciente/${id_paciente}`, {
        method: "PUT",
        body: JSON.stringify({
          name: nombre,
          edad: edad,
          sangre: tipoSangre,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()
      setPaciente({
        ...paciente,
        showResult: true,
        apiResponse: responseData,
      })
      toast.success("Paciente editado con exito")
      handleClose()
    }
  }

  const validate = () => {
    if (nombre === "") {
      toast.error("El nombre es obligatorio")
      return false
    } else if (edad === "") {
      toast.error("La edad es obligatoria")
      return false
    } else if (tipoSangre === "") {
      toast.error("El tipo de sangre es obligatoria")
      return false
    } else {
      return true
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Crear nuevo Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={edit}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tipo de sangre</label>
            <input
              type="text"
              className="form-control"
              value={tipoSangre}
              onChange={(e) => setTipoSangre(e.target.value)}
            />
          </div>
          {/* este es un ejemplo de como se hace un select
           <div className="mb-3">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
            >
              <option value="0">Seleccione un rol</option>
              <option value="1">Administrador</option>
              <option value="2">Almacen</option>
              <option value="3">Jefe de area</option>
            </select>
          </div> */}
          <Button
            variant="secondary"
            onClick={handleClose}
            className="m-2"
          >
            Cerrar
          </Button>
          <Button
            variant="primary"
            type="submit"
          >
            Guardar
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

export default function ModalNewPacientes({ show, handleClose }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()
  const [nombre, setNombre] = useState("")
  const [edad, setEdad] = useState("")
  const [tipoSangre, setTipoSangre] = useState("")
  const { getAccessTokenSilently, user } = useAuth0()

  const [pacientes, setPacientes] = useState({
    showResult: false,
    apiResponse: "",
    error: null,
  })

  useEffect(() => {
    limpiar()
  }, [show])

  const store = async (e) => {
    e.preventDefault()
    if (validate()) {
      const token = await getAccessTokenSilently()

      const response = await fetch(`${apiOrigin}/api/paciente`, {
        method: "POST",
        body: JSON.stringify({
          name: nombre,
          edad: edad,
          sangre: tipoSangre,
          idDoctor: user.sub.split("|")[1],
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()
      setPacientes({
        ...pacientes,
        showResult: true,
        apiResponse: responseData,
      })
      toast.success("Paciente creado con exito")
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

  const limpiar = () => {
    setEdad("")
    setNombre("")
    setTipoSangre("")
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
        <form onSubmit={store}>
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

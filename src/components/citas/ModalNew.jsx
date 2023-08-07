import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"
//componentes
import PacientesSelect from "./PacientesSelect"

export default function ModalNew({ show, handleClose }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()
  const [paciente, setPaciente] = useState("")
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const { getAccessTokenSilently } = useAuth0()

  const { user } = useAuth0()

  const [citas, setCitas] = useState({
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
      const idDoctor = user.sub.split("|")[1]
      const idPaciente = paciente
      const response = await fetch(`${apiOrigin}/api/citas`, {
        method: "POST",
        body: JSON.stringify({
          paciente: idPaciente,
          fecha,
          hora,
          doctor: idDoctor,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      const responseData = await response.json()
      setCitas({
        ...citas,
        showResult: true,
        apiResponse: responseData,
      })
      if (responseData.error) {
        const errors = responseData.error?.errors
        Object.keys(errors).forEach(function (key) {
          toast.error(errors[key]["message"])
        })
      } else {
        toast.success("Cita creada con exito")
        handleClose()
      }
    }
  }

  const validate = () => {
    if (fecha === "") {
      toast.error("La fecha es requerida")
      return false
    } else if (hora === "") {
      toast.error("La hora es requerida")
      return false
    } else {
      return true
    }
  }

  const limpiar = () => {
    setFecha("")
    setPaciente("")
    setHora("")
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Agendar cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={store}>
          <div className="mb-3">
            <label className="form-label">Paciente</label>
            <PacientesSelect setPaciente={setPaciente} />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Hora</label>
            <input
              type="time"
              className="form-control"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />
          </div>

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

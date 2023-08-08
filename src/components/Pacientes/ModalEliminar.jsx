import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

export default function ModalEliminar({ show, handleClose, id_paciente }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()

  const { getAccessTokenSilently } = useAuth0()

  async function deletePaciente(id_paciente) {
    try {
      const token = await getAccessTokenSilently()
      console.log("id -> ", id_paciente)
      let res = await fetch(`${apiOrigin}/api/paciente/${id_paciente}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("res -> ", res)
      if (res.status === 204 || res.status === 200) {
        toast.success("Paciente eliminado")
        handleClose()
      } else {
        toast.error("Error al eliminar el paciente")
      }
    } catch (error) {
      toast.error("Error al eliminar el paciente")
    }
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <p>¿Está seguro que desea eliminar el paciente?</p>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="mt-2"
          >
            Cerrar
          </Button>
          <Button
            variant="danger"
            onClick={() => deletePaciente(id_paciente)}
            className="mt-2"
          >
            Eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

export default function ModalEliminar({ show, handleClose, citaId }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()

  const { getAccessTokenSilently } = useAuth0()

  async function deleteCita(citaId) {
    try {
      const token = await getAccessTokenSilently()
      let res = await fetch(`${apiOrigin}/api/citas/${citaId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("res -> ", res)
      if (res.status === 204) {
        toast.success("Cita eliminada")
        handleClose()
      } else {
        toast.error("Error al eliminar la cita")
      }
    } catch (error) {
      toast.error("Error al eliminar la cita")
    }
  }
  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <p>¿Está seguro que desea eliminar la cita?</p>
          <Button
            variant="secondary"
            onClick={handleClose}
            className="mt-2"
          >
            Cerrar
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteCita(citaId)}
            className="mt-2"
          >
            Eliminar
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

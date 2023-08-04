import React, { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { getConfig } from "../../config"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

export default function ModalDetails({ show, handleClose, citaDetails }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()

  const { getAccessTokenSilently } = useAuth0()

  console.log(citaDetails)
  return (
    <Modal
      show={show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modificar cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <h1>Detalles de la cita</h1>

          {citaDetails && (
            <>
              <div className="row">
                <div className="col-6 mt-5">
                  <label htmlFor="paciente">Paciente</label>
                  <input
                    type="text"
                    className="form-control"
                    id="paciente"
                    value={citaDetails.paciente?.name}
                    disabled
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleClose}
                className="mt-5"
              >
                Cerrar
              </Button>
            </>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}

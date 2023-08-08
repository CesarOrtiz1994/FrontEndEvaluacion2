import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getConfig } from "../../config";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";


export default function ModalEditMedicamentos({ show, handleClose, id_medicamento }) {
  const { apiOrigin = "http://localhost:3010" } = getConfig();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dosisRec, setDosisRec] = useState("");
  const [efectosSec, setEfectosSec] = useState("");
  const [contraindicaciones, setContraindicaciones] = useState("");
  const [fechaCaduc, setFechaCaduc] = useState("");
  const { getAccessTokenSilently } = useAuth0();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const [medicamento, setMedicamento] = useState({
    showResult: false,
    apiResponse: "",
    error: null,
  });


    useEffect(() => {
    if (id_medicamento !== 0) {

      const getPaciente = async () => {
        try {
          const token = await getAccessTokenSilently();

          const response = await fetch(`${apiOrigin}/api/medicamento/${id_medicamento}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const responseData = await response.json();
          if (responseData) {
            setNombre(responseData.nombre);
            setDescripcion(responseData.descripcion);
            setDosisRec(responseData.dosisRec);
            setEfectosSec(responseData.efectosSec);
            setContraindicaciones(responseData.contraindicaciones);
            setFechaCaduc(responseData.fechaCaduc);
          }
        } catch (error) {
          setState({
            ...state,
            error: error.error,
          });
        }
      };

      getPaciente();
      }
    }, [id_medicamento]);

  const edit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/medicamento/${id_medicamento}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: nombre,
          descripcion: descripcion,
          dosisRec: dosisRec,
          efectosSec: efectosSec,
          contraindicaciones: contraindicaciones,
          fechaCaduc: fechaCaduc,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setMedicamento({
        ...medicamento,
        showResult: true,
        apiResponse: responseData,
      });
      toast.success("Medicamento editado con exito");
      handleClose();
     }
   };

  const validate = () => {
    if (nombre === "") {
      toast.error("El nombre es obligatorio");
      return false;
    } else if (dosisRec === "") {
      toast.error("La dosis recomendada es obligatoria");
      return false;
    } else if (fechaCaduc === "") {
      toast.error("La fecha de caducidad es obligatoria");
      return false;
    } else {
      return true;
    }
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Medicamento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={edit}>
        <div className="mb-3">
            <label className="form-label">Nombre del medicamento:</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={100}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción del medicamento:</label>
            <textarea
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dosis recomendada:</label>
            <input
              type="text"
              className="form-control"
              value={dosisRec}
              onChange={(e) => setDosisRec(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Efectos secundarios:</label>
            <textarea
              className="form-control"
              value={efectosSec}
              onChange={(e) => setEfectosSec(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraindicaciones:</label>
            <textarea
              className="form-control"
              value={contraindicaciones}
              onChange={(e) => setContraindicaciones(e.target.value)}
              maxLength={500}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Fecha de caducidad:</label>
            <input
              type="date"
              className="form-control"
              value={fechaCaduc}
              onChange={(e) => setFechaCaduc(e.target.value)}
              
            />
          </div>
          <Button variant="secondary" onClick={handleClose} className="m-2">
            Cerrar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
}

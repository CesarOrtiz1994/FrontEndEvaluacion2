import React, { useState, useEffect } from "react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { Alert } from "reactstrap";
import { GiMedicines } from "react-icons/gi";

import { ToastContainer, toast } from "react-toastify";
import ModalNewMedicamentos from "../components/Medicamentos/ModalNewMedicamentos";
import ModalEditMedicamentos from "../components/Medicamentos/ModalEditMedicamentos";


export const MedicamentosApiComponent = () => {
  const { apiOrigin = "http://localhost:3010" } = getConfig();

  const [state, setState] = useState({
    showResult: false,
    apiMessage: "",
    error: null,
  });

  const [medicamentos, setMedicamentos] = useState({
    showResult: false,
    apiResponse: "",
    error: null,
  });

  const [showNuevo, setShowNuevo] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [id, setId] = useState(0);

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0();

  const handleClose = () => {
    setShowNuevo(false);
    setShowEdit(false);
    getMedicamentos();
  };

  const handleShowNuevo = () => {
    setShowNuevo(true);
  };

  const handleShowEdit = (id) => {
    setShowEdit(true);
    setId(id);
  };

  useEffect(() => {
    getMedicamentos();
  }, []);

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);

      const response = await fetch(`${apiOrigin}/api/private`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setState({
        ...state,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const getMedicamentos = async () => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/medicamentos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      setMedicamentos({
        ...medicamentos,
        showResult: true,
        apiResponse: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const deleteMedicamento = async (id) => {
    try {
      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiOrigin}/api/medicamento/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success("Medicamento eliminado.");
        getMedicamentos();
      }
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

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
          <h1>Medicamentos</h1>
          <button
            className="btn btn-outline-success fs-5 mb-2"
            onClick={handleShowNuevo}
          >
            <GiMedicines /> Nuevo Medicamento
          </button>
        </div>

        <div className="divhr"></div>
        <br />

        {medicamentos.apiResponse && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Dosis recomendada</th>
              <th scope="col">Fecha de caducidad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            { medicamentos.apiResponse.map((medicamento) => (
              <tr key={medicamento._id}>
                <td>{medicamento.nombre}</td>
                <td>{medicamento.dosisRec}</td>
                <td>{medicamento.fechaCaduc}</td>
                <td>
                  <button
                    className="btn btn-outline-danger me-2"
                    onClick={() => deleteMedicamento(medicamento._id)}
                  >
                    Eliminar
                  </button>
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => handleShowEdit(medicamento._id)}
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

      <ModalNewMedicamentos show={showNuevo} handleClose={handleClose}/>
      <ModalEditMedicamentos show={showEdit} handleClose={handleClose} id_medicamento={id}/>

    </>
  );
};

export default withAuthenticationRequired(MedicamentosApiComponent, {
  onRedirecting: () => <Loading />,
});

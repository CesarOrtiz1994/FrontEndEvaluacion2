//Una cita no deberia ser modificada, pero dejo el codigo por si acaso, falta completar

// import React, { useEffect, useState } from "react"
// import { useAuth0 } from "@auth0/auth0-react"
// import { getConfig } from "../../config"
// import Button from "react-bootstrap/Button"
// import Modal from "react-bootstrap/Modal"
// import { toast } from "react-toastify"

// export default function ModalEditar({ show, handleClose, citaDetails }) {
//   console.log(citaDetails)
//   const { apiOrigin = "http://localhost:3010" } = getConfig()
//   const [paciente, setPaciente] = useState(citaDetails?.paciente)
//   const [fecha, setFecha] = useState("")
//   const [hora, setHora] = useState("")
//   const [doctor, setDoctor] = useState("")
//   const { getAccessTokenSilently } = useAuth0()

//   // const paciente = citaDetails.paciente

//   const [state, setState] = useState({
//     showResult: false,
//     apiMessage: "",
//     error: null,
//   })

//   const [cita, setCita] = useState({
//     showResult: false,
//     apiResponse: "",
//     error: null,
//   })

//   useEffect(() => {
//     // if (id_cita !== 0) {
//     //   const getPaciente = async () => {
//     //     try {
//     //       const token = await getAccessTokenSilently()
//     //       const response = await fetch(`${apiOrigin}/api/citas/${id_cita}`, {
//     //         method: "GET",
//     //         headers: {
//     //           Authorization: `Bearer ${token}`,
//     //         },
//     //       })
//     //       const responseData = await response.json()
//     //       if (responseData) {
//     //         setPaciente(responseData.paciente)
//     //         setDoctor(responseData.doctor)
//     //         setFecha(responseData.fecha)
//     //         setHora(responseData.hora)
//     //       }
//     //     } catch (error) {
//     //       setState({
//     //         ...state,
//     //         error: error.error,
//     //       })
//     //     }
//     //   }
//     //   getPaciente()
//     // }
//   }, [])

//   const edit = async (e) => {
//     e.preventDefault()
//     // if (validate()) {
//     //   const token = await getAccessTokenSilently()

//     //   const response = await fetch(`${apiOrigin}/api/citas/${id_cita}`, {
//     //     method: "PUT",
//     //     body: JSON.stringify({
//     //       paciente,
//     //       hora,
//     //       fecha,
//     //       doctor,
//     //     }),
//     //     headers: {
//     //       "Content-Type": "application/json",
//     //       Authorization: `Bearer ${token}`,
//     //     },
//     //   })

//     //   const responseData = await response.json()
//     //   setCita({
//     //     ...cita,
//     //     showResult: true,
//     //     apiResponse: responseData,
//     //   })
//     //   toast.success("Cita modificada con exito")
//     //   handleClose()
//     // }
//   }

//   const validate = () => {
//     if (paciente === "") {
//       toast.error("Elegir paciente es obligatorio")
//       return false
//     } else if (hora === "") {
//       toast.error("La hora es requerida")
//       return false
//     } else if (fecha === "") {
//       toast.error("Eliga una fecha")
//       return false
//     } else {
//       return true
//     }
//   }
//   console.log("Paciente, : ", paciente)

//   return (
//     <Modal
//       show={show}
//       onHide={handleClose}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>Modificar cita</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <form onSubmit={edit}>
//           <div className="mb-3">
//             <label className="form-label">Paciente</label>
//             <input
//               type="text"
//               className="form-control"
//               value={paciente?.name}
//               onChange={(e) => setPaciente(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Fecha</label>
//             <input
//               type="number"
//               className="form-control"
//               value={fecha}
//               onChange={(e) => setFecha(e.target.value)}
//             />
//           </div>
//           <div className="mb-3">
//             <label className="form-label">Hora</label>
//             <input
//               type="text"
//               className="form-control"
//               value={hora}
//               onChange={(e) => setHora(e.target.value)}
//             />
//           </div>
//           {/* este es un ejemplo de como se hace un select
//            <div className="mb-3">
//             <label className="form-label">Rol</label>
//             <select
//               className="form-select"
//               value={rol}
//               onChange={(e) => setRol(e.target.value)}
//             >
//               <option value="0">Seleccione un rol</option>
//               <option value="1">Administrador</option>
//               <option value="2">Almacen</option>
//               <option value="3">Jefe de area</option>
//             </select>
//           </div> */}
//           <Button
//             variant="secondary"
//             onClick={handleClose}
//             className="m-2"
//           >
//             Cerrar
//           </Button>
//           <Button
//             variant="primary"
//             type="submit"
//           >
//             Guardar
//           </Button>
//         </form>
//       </Modal.Body>
//     </Modal>
//   )
// }

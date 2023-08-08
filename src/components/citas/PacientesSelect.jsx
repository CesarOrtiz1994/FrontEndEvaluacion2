import React from "react"
import Select from "react-select"
import { useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useState } from "react"
import { getConfig } from "../../config"

export default function PacientesSelect(props) {
  const { apiOrigin = "http://localhost:3010" } = getConfig()
  const { getAccessTokenSilently, user } = useAuth0()
  const [options, setOptions] = useState([])

  async function getPacientes() {
    const token = await getAccessTokenSilently()
    const idDoctor = user.sub.split("|")[1]

    const response = await fetch(`${apiOrigin}/api/pacientes`, {
      method: "POST",
      body: JSON.stringify({
        idDoctor: idDoctor
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    const pacientes = await response.json()
    // console.log(pacientes)
    const options = pacientes.map((paciente) => {
      console.log(paciente._id, paciente.name)
      return { value: paciente._id, label: paciente.name }
    })
    console.log(options)
    setOptions(options)
  }
  useEffect(() => {
    getPacientes()
  }, [])
  return (
    <Select
      options={options}
      onChange={(e) => props.setPaciente(e.value)}
    />
  )
}

import React, { useEffect, useState } from 'react'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import PersonaService from '../../service/PersonaService';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './empleados.scss'

const Team = () => {

  const [personas, setPersonas] = useState([])

  useEffect(() => {
    let personaService = new PersonaService();
    personaService.getAll().then(data => setPersonas(data));
    
  }, [])

  // console.log(personas)

  return (
    <div className="empleados">

      <Sidebar />
      <div className='empleadosContainer'>
      <Navbar />
      <DataTable value={personas}>
        <Column field="id" header="ID"></Column>
        <Column field="nombre" header="Apellido"></Column>
        <Column field="apellido" header="Apellido"></Column>
      </DataTable>
      </div>
    </div>
  )
}

export default Team
"use client"
import { NotebookText, Phone, User } from 'lucide-react';
import React from 'react';


interface Datos {
    datosMenor: {
        nombre: string;
        apellido: string;
        fechaNacimiento: string;
        correoElectronico: string;
        dni: number;
        pais: string;
        provincia: string;
        localidad: string;
        calle: string;
        numero: number;
      };
    datosMayor: {
        nombre: string;
        apellido: string;
        telefono: number;
        correoElectronico: string;
        dni: number;
        pais: string;
        provincia: string;
        localidad: string;
        calle: string;
        numero: number;
    };
}

const DatosAlumno: React.FC<Datos> = ({ datosMenor, datosMayor }) => {
    const alumno = datosMenor;
    const responsable = datosMayor;
    const direccionAlumnoStr = `${alumno.calle || ''} ${alumno.numero || ''}, ${alumno.localidad || 'Unknown'}, ${alumno.provincia || 'Unknown'}, ${alumno.pais || 'Unknown'}`;	
    const direccionResponsableStr = `${responsable.calle || ''} ${responsable.numero || ''}, ${responsable.localidad || 'Unknown'}, ${responsable.provincia || 'Unknown'}, ${responsable.pais || 'Unknown'}`;

  
  
   
  
    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
          <div className="text-center mt-4">
            <h2 className="text-red-500 font-medium">
              Si faltan datos, deberás completarlos <a href="/usuario/Cuenta" className="text-sky-600 underline hover:text-sky-950">aquí.</a>
            </h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <NotebookText className="w-5 h-5" />
                Tu Información
              </h2>
            </div>
      
            <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6 bg-sky-50">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-700" />
                  Datos del Alumno
                </h3>
      
                <div className="mt-2 space-y-2">
                  <p className="font-medium"><span className="font-semibold">Nombre:</span> {alumno.nombre} {alumno.apellido}</p>
                  <p className="font-medium"><span className="font-semibold">DNI:</span> {alumno.dni}</p>
                  <p className="font-medium"><span className="font-semibold">Email:</span> {alumno.correoElectronico}</p>
                  <p className="font-medium"><span className="font-semibold">Fecha de Nacimiento:</span> {new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                  <p className="font-medium"><span className="font-semibold">Dirección:</span> {direccionAlumnoStr}</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6 bg-green-50">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-green-700" />
                  Datos del Responsable
                </h3>
      
                <div className="mt-2 space-y-2">
                  <p className="font-medium"><span className="font-semibold">Nombre:</span> {responsable.nombre} {responsable.apellido}</p>
                  <p className="font-medium"><span className="font-semibold">DNI:</span> {responsable.dni}</p>
                  <p className="font-medium"><span className="font-semibold">Email:</span> {responsable.correoElectronico}</p>
                  <p className="font-medium"><span className="font-semibold">Teléfono:</span> {responsable.telefono}</p>
                  <p className="font-medium"><span className="font-semibold">Dirección:</span> {direccionResponsableStr}</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      );
  };
export default DatosAlumno;
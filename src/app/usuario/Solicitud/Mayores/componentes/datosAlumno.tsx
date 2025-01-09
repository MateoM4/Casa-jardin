"use client"
import { List, User } from 'lucide-react';
import React, { useState } from 'react';


interface Datos {
    setDatosAlumno: React.Dispatch<React.SetStateAction<{
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
        fechaNacimiento: string;
    }>>;
    datosAlumno: {
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
        fechaNacimiento: string;
    };
    setError: React.Dispatch<React.SetStateAction<string>>;
}

const DatosAlumno: React.FC<Datos> = ({ datosAlumno }) => {
    const alumno = datosAlumno;
    const direcciónCompleta = `${alumno.calle} ${alumno.numero}, ${alumno.localidad}, ${alumno.provincia}, ${alumno.pais}`;
    //console.log('Alumno mayoooo:', alumno);
   

    
  
  return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">   
        <div className="text-center mt-4">
            <p className="text-black font-medium">
            Si faltan datos deberá completarlos para poder continuar el proceso de inscripción. Completelos <a href="/ruta-a-completar-datos" className="text-sky-600 underline hover:text-sky-900">aquí</a>
            </p>
        </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <List className="w-5 h-5" />
                    Sus Datos
              </h2>
            </div>
  
            <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6 bg-sky-50">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-5 h-5 text-sky-700" />
                  Datos Personales</h3>
                <div className="mt-2 space-y-2">
                  <p className="font-medium"><span className="font-semibold">Nombre:</span> {alumno.nombre} {alumno.apellido}</p>
                  <p className="font-medium"><span className="font-semibold">DNI:</span> {alumno.dni}</p>
                  <p className="font-medium"><span className="font-semibold">Email:</span> {alumno.correoElectronico}</p>
                  <p className="font-medium"><span className="font-semibold">Fecha de Nacimiento:</span> {new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                  <p className="font-medium"><span className="font-semibold">Dirección:</span> {direcciónCompleta}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
    );
  };
  
  export default DatosAlumno;
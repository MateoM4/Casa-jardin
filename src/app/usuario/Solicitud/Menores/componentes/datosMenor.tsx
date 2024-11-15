"use client";
import React, { useEffect, useState } from "react";

interface Datos {
  //lo que recibe de la cuenta logeada
  datosMenor: {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    dni: number;
    pais: string;
    provincia: string;
    localidad: string;
    calle: string;
    numero: number;
  };
  //lo que va a devolver
  setDatosMenor: React.Dispatch<
    React.SetStateAction<{
      nombre: string;
      apellido: string;
      fechaNacimiento: string;
      dni: number;
      pais: string;
      provincia: string;
      localidad: string;
      calle: string;
      numero: number;
    }>
  >;
}

const DatosMenor: React.FC<Datos> = ({ datosMenor, setDatosMenor }) => {
  // Estado para almacenar mensajes de error
  const [errorMessage, setErrorMessage] = useState<string>("");
  useEffect(() => {
    console.log("inside datosMenor: data:", datosMenor);
  }, []);
  return (
    <div>
      <div className="p-4">
        <h3 className="p-2 shadow-md w-60">Inscripción a talleres - Menores</h3>
      </div>

      <div className="flex flex-col">
        <h1 className="flex  items-center justify-center  font-bold text-2xl">
          Datos del Menor
        </h1>
        <div className="flex  justify-center ">
          <div className=" mx-auto  rounded-lg  px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl">
            <div className="flex-col p-3 flex ">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Ingrese su nombre"
                className="border rounded"
                value={datosMenor.nombre ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({ ...prev, nombre: e.target.value }))
                }
              />
            </div>

            <div className="flex-col p-3 flex ">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                placeholder="Ingrese su apellido"
                className="border rounded"
                value={datosMenor.apellido ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    apellido: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex-col p-3 flex">
              <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                id="fechaNacimiento"
                type="date"
                className="border rounded"
                value={datosMenor.fechaNacimiento ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    fechaNacimiento: e.target.value,
                  }))
                }
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0]} // Set min to 100 years ago
                max={new Date().toISOString().split('T')[0]} // Set max to today's date
                required
              />
            </div>

            <div className="flex-col p-3 flex">
              <label htmlFor="dni">DNI</label>
              <input
                id="dni"
                type="text"
                placeholder="Ingrese su DNI"
                className="border rounded"
                value={datosMenor.dni ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    dni: parseInt(e.target.value),
                  }))
                }
              />
            </div>

            <div className="flex-col p-3 flex ">
              <label htmlFor="pais">País</label>
              <input
                id="pais"
                type="text"
                placeholder="Ingrese su país"
                className="border rounded"
                value={datosMenor.pais ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({ ...prev, pais: e.target.value }))
                }
              />
            </div>

            <div className="flex-col p-3 flex ">
              <label htmlFor="provincia">Provincia</label>
              <input
                id="provincia"
                type="text"
                placeholder="Ingrese su provincia"
                className="border rounded"
                value={datosMenor.provincia ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    provincia: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex-col p-3 flex">
              <label htmlFor="localidad">Localidad</label>
              <input
                id="localidad"
                type="text"
                placeholder="Ingrese su localidad"
                className="border rounded"
                value={datosMenor.localidad ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    localidad: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex-col p-3 flex">
              <label htmlFor="calle">Calle</label>
              <input
                id="calle"
                type="text"
                placeholder="Ingrese su calle"
                value={datosMenor.calle ?? ''}
                className="border rounded"
                onChange={(e) =>
                  setDatosMenor((prev) => ({ ...prev, calle: e.target.value }))
                }
              />
            </div>

            <div className="flex-col p-3 flex ">
              <label htmlFor="numero">Número</label>
              <input
                id="numero"
                type="text"
                placeholder="Ingrese el número"
                className="border rounded"
                value={datosMenor.numero ?? ''}
                onChange={(e) =>
                  setDatosMenor((prev) => ({
                    ...prev,
                    numero: parseInt(e.target.value),
                  }))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DatosMenor;

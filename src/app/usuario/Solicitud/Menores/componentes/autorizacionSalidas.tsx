"use client"
import React, { useState } from 'react';


interface Datos {
    setDatosAutorizacionSalidas: React.Dispatch<React.SetStateAction<{
        firma: string;
        observaciones: string;
    }>>;
}

const AutorizacionSalidas: React.FC<Datos> = ({ setDatosAutorizacionSalidas }) => {
    return (
        <div>

            <div className='flex flex-col '>
                <h1 className='flex justify-center  font-bold text-2xl'>Autorización Anual para Salidas Cercanas</h1>
                <div className='flex  justify-center lg:w-1/2 md:1/2 sm:w-2/3 mx-auto mt-5 max-h-[45vh] overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-sm'>
                    <p className='w-1/2 text-center p-5'>Por medio de la presente, en mi carácter de Padre/Madre/ Tutor/Curador,
                        OTORGO AUTORIZACIÓN AL MENOR, para salir del CET CASA JARDIN. 
                        Durante el presente año de inscripción, cuando las actividades 
                        planificadas así lo requieran y bajo el cuidado de las profesionales 
                        del CET “Casa Jardín”.</p>
                </div>
                <div className='flex justify-center mt-4'>
                    <label className='flex items-center'>
                        <input type="checkbox" className='mr-2' onChange={(e) => {
                            if (e.target.checked) {
                                setDatosAutorizacionSalidas(prev => ({ ...prev, firma: "Autorizado" }));
                            } else {
                                setDatosAutorizacionSalidas(prev => ({ ...prev, firma: "" }));
                            }
                        }} />
                        Si está de acuerdo, marque la casilla
                    </label>
                </div>
                <div className='flex flex-col p-2  items-center'>
                    <label htmlFor="observaciones">Observaciones (opcional)</label>
                    <input className="w-[50vh] border rounded-md" type="text" name="observaciones" id="observaciones" onChange={(e) => setDatosAutorizacionSalidas(prev => ({ ...prev, observaciones: e.target.value }))} />
                </div>
{/*                 <div className='p-2   w-full justify-center mt-10'>
                    <div className='flex flex-col p-2  items-center'>
                        <label  htmlFor="firma">Firma de Padre/Madre/Tutor</label>
                        <input  className="w-[50vh] border rounded-md" placeholder='Ingrese su firma' type="text" name="firma" id="firma" onChange={(e) => setDatosAutorizacionSalidas(prev => ({ ...prev, firma: e.target.value }))}/>
                    </div>

                    <div className='flex flex-col p-2  items-center'>
                        <label htmlFor="observaciones">Observaciones</label>
                        <input  className="w-[50vh] border rounded-md" type="text" name="observaciones" id="observaciones" onChange={(e) => setDatosAutorizacionSalidas(prev => ({ ...prev, observaciones: e.target.value }))}/>
                    </div>
                </div> */}
            </div>


        </div>
    )
}
export default AutorizacionSalidas;
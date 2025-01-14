"use client"
import React from 'react';


interface Datos {
    setDatosSalud: React.Dispatch<React.SetStateAction<{
        enfermedad: string;
        alergia: string;
        tratamiento: string;
        terapia: string;
        consultasEspecialistas: string;
        motivoInscripcion: string;
    }>>;
}

const CondicionSalud: React.FC<Datos> = ({ setDatosSalud }) => {
 
    return (
        <div className="flex flex-col p-5 items-center">
            <h1 className="flex font-bold text-2xl">Condición de salud</h1>
            <div className="flex flex-col w-full max-w-2xl justify-center items-center border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="border-b w-full p-2">
                <label htmlFor="enfermedad">¿Tiene o ha tenido alguna enfermedad?</label>
                <div className="flex items-center">
                    <input
                        id="enfermedad"
                        type="text"
                        className="w-full max-w-md rounded-md border"
                        onChange={(e) => setDatosSalud(prev => ({ ...prev, enfermedad: e.target.value }))}
                    />
                </div>
            </div>
            <div className="border-b w-full p-2">
                <label htmlFor="alergia">¿Presenta alguna alergia?</label>
                <div className="flex items-center">
                    <input
                        id="alergia"
                        type="text"
                        className="w-full max-w-md rounded-md border"
                        onChange={(e) => setDatosSalud(prev => ({ ...prev, alergia: e.target.value }))}
                    />
                </div>
            </div>
            <div className="border-b w-full p-2">
                <label htmlFor="tratamiento">¿Está actualmente con algún tratamiento y/o medicación?</label>
                <div className="flex items-center">
                    <input
                        id="tratamiento"
                        type="text"
                        className="w-full max-w-md rounded-md border"
                        onChange={(e) => setDatosSalud(prev => ({ ...prev, tratamiento: e.target.value }))}
                    />
                </div>
            </div>
            <div className="border-b w-full p-2">
                <label htmlFor="terapia">¿Se encuentra realizando terapia/s?</label>
                <div className="flex items-center">
                    <input
                        id="terapia"
                        type="text"
                        className="w-full max-w-md rounded-md border"
                        onChange={(e) => setDatosSalud(prev => ({ ...prev, terapia: e.target.value }))}
                    />
                </div>
            </div>
            <div className="border-b w-full p-2">
                <label htmlFor="consultasEspecialistas">¿Ha llevado a cabo consultas con especialistas? (neurologo, cardiologo, fisioterapeuta, etc.)</label>
                <div className="flex items-center">
                    <input
                        id="consultasEspecialistas"
                        type="text"
                        className="w-full max-w-md rounded-md border"
                        onChange={(e) => setDatosSalud(prev => ({ ...prev, consultasEspecialistas: e.target.value }))}
                    />
                </div>
            </div>
            <div className="w-full p-2">
                <label htmlFor="MotivoInscripcion">¿Cuál es el motivo de que su hijo/a asista a casa jardín? (ej. Recreación, aprendizaje, vínculos)</label>
                <div className="flex items-center">
                    <input
                    type="text"
                    className="w-full max-w-md rounded-md border"
                    onChange={(e) => setDatosSalud(prev => ({ ...prev, motivoInscripcion: e.target.value }))}
                    />
                </div>
            </div>
            </div>
        </div>
    )
}
export default CondicionSalud;
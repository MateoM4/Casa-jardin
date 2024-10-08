"use client"
import React, { useEffect, useState } from 'react';
import Navigate from "../../../components/alumno/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getCursos } from '@/services/cursos';
import { getAlumnoByCooki } from '@/services/Alumno';


const principal: React.FC = () => {

    const [cursos, setCursos] = useState<any[]>([]);
    const [userName, setUserName] = useState<any>('');

    async function getAllCursos() {
        const talleres = await getCursos();
        const user = await getAlumnoByCooki();
        console.log(user?.nombre);
        setUserName(user?.nombre);
        setCursos(talleres);
    }

    useEffect(() => {
        if (cursos.length === 0)   getAllCursos();
    }, [cursos]);

    return (
        <main className='flex'>
            <Navigate /> 

            <div className='absolute top-20 p-10'>
                <h1 className=''>Bienvenido de regreso, {userName}</h1>
                <div className=' flex justify-center items-center mt-40 w-screen'>
                    <div className='m-4'>
                        <img src="" alt="contacto" />
                        <a href="#">Contacto</a>
                    </div>
                    <div className='m-4'>
                        <img src="" alt="correo" />
                        <a href="#">Correo</a>
                    </div>
                    <div className='m-4'>
                        <img src="" alt="propuestas" />
                        <a href="#">Propuestas</a>
                    </div>
                    <div className='m-4'>
                        <img src="" alt="editCuenta" />
                        <a href="/usuario/Cuenta">Mi cuenta</a>
                    </div>
                </div>
            
                <h1 className='mt-40 mb-10'>Mis Talleres</h1>
                <div className='flex ml-5 mt-5'>
                    {cursos.map((curso) => (
                        <div key={curso.id} className='m-4'>
                            <img src={curso.imagen} alt={curso.nombre} />
                            <h2>{curso.nombre}</h2>

                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 mt-20 bg-white w-full" style={{opacity: 0.66}}>
                <But_aside />
            </div>
        </main>
    )
}
export default principal;
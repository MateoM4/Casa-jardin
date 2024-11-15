"use client"
import React, { useEffect, useState } from 'react';
import Navigate from "../../../components/alumno/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getcursosByIdAlumno } from '@/services/alumno_curso';

import { Curso, getCursoById } from '@/services/cursos';
import Image from "next/image";
import correoIcon from "../../../../public/Images/correoIcon.png";
import phoneIcon from "../../../../public/Images/phoneIcon.png";
import propuestasIcon from "../../../../public/Images/LogoCasaJardin.png";
import editCuentaIcon from "../../../../public/Images/PenIcon.png";
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import { getAlumnoByEmail } from '@/services/Alumno';
import withAuthUser from "../../../components/alumno/userAuth";
import { getDireccionCompleta } from '@/services/ubicacion/direccion';


const principal: React.FC = () => {

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [userName, setUserName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [usuario, setUsuario] = useState<any>(null);

    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        const authorizeAndFetchData = async () => {

            // Primero verifico que el user esté logeado
            //  console.log("router", router);
            await autorizarUser(router);
            // Una vez autorizado obtengo los datos del user y seteo el email
            const user = await fetchUserData();
            // console.log("user", user);
            //const direccion = await getDireccionByIdDef(Number(user?.direccionId));
            setUsuario(user);
            setUserName(user?.nombre + " " + user?.apellido); 

            // Fetch cursos
            await getAllCursos();
        };

        authorizeAndFetchData();
    }, [router]);

    async function getAllCursos() {
        //      console.log("USER", usuario);
        //const direccion = await getDireccionByIdDef(Number(user?.direccionId));
        //        console.log("DIRECCION", usuario?.direccionId);
        //console.log("DIRECCION DEFINIT",direccion);
        let talleres: Curso[] = [];
        if (usuario) {
            const result = await getcursosByIdAlumno(Number(usuario?.id));
            for(let i = 0; i < result.length; i++){
                const curso = await getCursoById(result[i]);
                talleres.push(curso as Curso);
            }
        }
        //  console.log(usuario?.nombre);
        //setUserName(String(usuario?.nombre));
        setCursos(talleres);
    }
/* 
    useEffect(() => {
        if (cursos.length === 0) getAllCursos();
    }, [cursos]); */

    return (
        <main className=''>
            <div className="fixed bg-red-500  justify-between w-full p-4" >
                <Navigate />
            </div>
            <div className='absolute top-20 '>
                <h1 className='absolute top-20 left-10'>Bienvenido de regreso, {userName}</h1>
                <div className=' flex   justify-center items-center mt-40 w-screen'>
                    <button className='m-4 flex flex-col items-center'/*  onClick={() => window.location.href = '/usuario/Contacto'} */>
                        <Image src={phoneIcon} alt="telefono" width={80} height={80} />
                        <span>Contacto</span>
                    </button>
                    <button className='m-4 flex flex-col items-center' /* onClick={() => window.location.href = '/usuario/Correo'} */>
                        <Image src={correoIcon} alt="correo" width={80} height={80} />
                        <span>Correo</span>
                    </button>
                    <button className='m-4 flex flex-col items-center'/*  onClick={() => window.location.href = '/usuario/Propuestas'} */>
                        <Image src={propuestasIcon} alt="propuestas" width={80} height={80} />
                        <span>Propuestas</span>
                    </button>
                    <button className='m-4 flex flex-col items-center' onClick={() => window.location.href = '/usuario/Cuenta'}>
                        <Image src={editCuentaIcon} alt="edit" width={80} height={80} />
                        <span>Mi cuenta</span>
                    </button>
                </div>
                <div className=' mt-40 mb-10 p-5'>
                    <h1 className=''>Mis Talleres</h1>
                    <div className='flex ml-5 mt-5 border'>
                         {cursos.map((curso) => (
                            <div key={curso.id} className='m-4'>
                                <img src={""} alt={curso.nombre} />
                                <h2>{curso.nombre}</h2>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default withAuthUser(principal);

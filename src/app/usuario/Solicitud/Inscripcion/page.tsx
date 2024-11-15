"use client"
import React, {useState, useEffect}from 'react';
import adultos from "../../../../../public/Images/adultos.jpg";
import menores from "../../../../../public/Images/menores.jpg";
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import withAuthUser from "../../../../components/alumno/userAuth";
import { autorizarUser, fetchUserData} from '@/helpers/cookies';
import { useRouter } from 'next/navigation';
import { calcularEdad } from '@/helpers/fechas';
const Inscripcion: React.FC<{}> = () => {

    const [edad, setEdad] = useState<number>(0);
    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
            const authorizeAndFetchData = async () => {
                // Primero verifico que el user esté logeado
                //console.log("router", router);
                await autorizarUser(router);
                // Una vez autorizado obtengo los datos del user y seteo el email
                const user = await fetchUserData();
                //console.log("user", user);
                if (user) {
                    setEdad(calcularEdad(user.fechaNacimiento));
                }
            };
            authorizeAndFetchData();
        
    }, [router]);
    return (
        <main>
            <div className="relative bg-red-500  justify-between w-full p-4" >
                <Navigate />
            </div>
            <div className='p-4'>
                <h3 className='p-2 shadow-md w-40'>Inscripción a talleres</h3>
            </div>
            <div className='flex justify-center mt-10'>
                <h1 className='font-bold text-xg'>Elija el tipo de inscripción</h1>
            </div>
            <div className='mt-4 border-b mx-auto px-8 py-6 grid grid-cols-2 gap-x-12 max-w-2xl'>
                <button className="flex flex-col items-center" onClick={()=> window.location.href = "/usuario/Solicitud/Menores"}>
                {edad !== null && edad < 18 ? (
                    <button className="flex flex-col items-center" onClick={() => window.location.href = "/usuario/Solicitud/Menores"}>
                        <Image src={menores} alt="menores" width={300} height={180} />
                        <span className='mt-2'>Inscripción para menores <br /> Uso de imagen y salidas cercanas</span>
                    </button>
                ) : (
                    <button className="flex flex-col items-center" onClick={() => window.location.href = "/usuario/Solicitud/Mayores"}>
                        <Image src={adultos} alt="adultos" width={280} height={100} />
                        <span className='mt-2'>Inscripción para adultos</span>
                    </button>
                )}
                </button>
            </div>
            <div className="flex justify-center items-center mt-5">
                <div className="text-center">
                    <h2 className="  mb-4 max-w-lg px-3 font-bold text-sm">Si desea continuar con la inscripción de manera presencial, descargue los siguientes formularios</h2>
                    <button className="  py-2 px-4 rounded">
                        <Image src={""} alt='menores.pdf' />
                        Inscripción para menores
                    </button>
                    <button className="  py-2 px-4 rounded mt-2">
                        <Image src={""} alt='adultos.pdf' />
                        Inscripción para adultos
                    </button>
                </div>
            </div>
            <div className="fixed bottom-0 py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default Inscripcion;
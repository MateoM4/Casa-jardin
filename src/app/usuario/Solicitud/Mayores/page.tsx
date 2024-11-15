"use client"
import React, { useState, useEffect, use } from 'react';
import But_aside from "../../../../components/but_aside/page";
import Image from "next/image";
import Navigate from '../../../../components/alumno/navigate/page';
import AutorizacionImg from './componentes/autorizacionImagen';
import Reglamentacion from './componentes/reglamentacion';
import SeleccionTaller from './componentes/seleccionTaller';
import DatosAlumno from './componentes/datosAlumno';
import EmailPage from '../email/EmailPage';
import { Alumno, createAlumno, getAlumnoByEmail, updateAlumno } from '@/services/Alumno';
import { addDireccion, getDireccionById, getDireccionCompleta } from '@/services/ubicacion/direccion';
import { addPais, getPaisById } from '@/services/ubicacion/pais';
import { addProvincias, getProvinciasById } from '@/services/ubicacion/provincia';
import { createSolicitudMayor } from '@/services/Solicitud/SolicitudMayor';
import { createSolicitud } from '@/services/Solicitud/Solicitud';
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import { addLocalidad, getLocalidadById } from '@/services/ubicacion/localidad';
import { createAlumno_Curso } from '@/services/alumno_curso';
import { createCursoSolicitud } from '@/services/curso_solicitud';
import withAuthUser from "../../../../components/alumno/userAuth";
import { calcularEdad, dateTimeToDate } from '@/helpers/fechas';

const Mayores: React.FC = () => {
    //region UseState

    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);

    const [datosAlumno, setDatosAlumno] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        fechaNacimiento: "",
        correoElectronico: "",
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosAutorizacionImage, setDatosAutorizacionImage] = useState({
        firma: "",
        observaciones: "",
    });
    const [datosReglamentacion, setDatosReglamentacion] = useState({
        firma: "",
    });

    const [error, setError] = useState<string>('');
    const [verificarEmail, setVerificarEmail] = useState<boolean>(false);
    const [correcto, setCorrecto] = useState(false);
    const [user, setUser] = useState<any>();


    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        if(!user){
            const authorizeAndFetchData = async () => {
                // Primero verifico que el user esté logeado
                //console.log("router", router);
                await autorizarUser(router);
                // Una vez autorizado obtengo los datos del user y seteo el email
                const user = await fetchUserData();
                
                //console.log("user", user);
                if (user) {
                    setUser(user);
                }
            };
    
            authorizeAndFetchData();
        }
    }, [router]);

    useEffect(() => {
        if(correcto) {
            cargarSolicitud();
            setVerificarEmail(false);
        }
    }, [correcto])
    useEffect(() => {
        if (user) {
            const cargarAlumno = async () => {
                /* const direccion = await getDireccionById(Number(user.direccionId))
                const localidad = await getLocalidadById(Number(direccion?.localidadId))
                const provincia = await getProvinciasById(Number(localidad?.provinciaId))
                const pais = await getPaisById(Number(provincia?.nacionalidadId))
 */
                const direccion = await getDireccionCompleta(Number(user.direccionId))
                const localidad = direccion?.localidad
                const provincia = localidad?.provincia
                const pais = provincia?.nacionalidad
                console.log("fecha de nacimiento ----------------------------------", user.fechaNacimiento)
                console.log("convertir fecha de nacimiento ----------------------------------", dateTimeToDate(user.fechaNacimiento))
                console.log("edad ----------------------------------", calcularEdad(user.fechaNacimiento))
                setDatosAlumno({
                    nombre: user.nombre,
                    apellido: user.apellido,
                    telefono: user.telefono,
                    correoElectronico: user.email,
                    fechaNacimiento: user.fechaNacimiento,
                    dni: user.dni,
                    pais: pais?.nombre || "",
                    provincia: provincia?.nombre || "",
                    localidad: (localidad?.nombre) || "",
                    calle: direccion?.calle || "",
                    numero: direccion?.numero || 0,
                })
            }
            cargarAlumno()
        }
    }, [user])

    //region funciones  

    //datos mayor: nombre, apellido, telefono, correo electronico, dni, pais, localidad, calle
    //datos autorizacionImage: firmo el mayor a cargo?, observaciones? puede ser nulo
    //datos reglamentacion: firmo?
    function validateDatos() {
        // carrateres especiales en el nombre y la descripción
        const regex = /^[a-zA-Z0-9_ ,.;áéíóúÁÉÍÓÚñÑüÜ@]*$/; // no quiero que tenga caracteres especiales que las comas y puntos afecten 


        if (selectedScreen === 0 && selectedCursosId.length === 0) return "Debe seleccionar al menos un taller";
        if (selectedScreen === 1) {
            // Validar que el nombre tenga al menos 2 caracteres
            if (datosAlumno.nombre.length < 1 && regex.test(datosAlumno.nombre)) {
                return ("El nombre debe tener al menos 2 caracteres.");
            }
            if (datosAlumno.apellido.length < 1 && regex.test(datosAlumno.apellido)) {
                return ("El apellido debe tener al menos 2 caracteres.");
            }
            if ((datosAlumno.telefono).toString().length != 9) {
                return ("El telefono debe tener al menos 9 números.");
            }
            if (datosAlumno.correoElectronico.length < 11 || !datosAlumno.correoElectronico.includes('@')) {
                return ("El correo electrónico debe tener al menos 11 caracteres y contener '@'.");
            }
            if ((datosAlumno.dni).toString().length != 8) {
                return ("El DNI debe tener al menos 8 números.");
            }
            if (datosAlumno.pais.length < 1 && regex.test(datosAlumno.pais)) {
                return ("El país debe tener al menos 2 caracteres.");
            }
            if (datosAlumno.provincia.length < 1 && regex.test(datosAlumno.provincia)) {
                return ("La provincia debe tener al menos 2 caracteres.");
            }
            if (datosAlumno.localidad.length < 1 && regex.test(datosAlumno.localidad)) {
                return ("La localidad debe tener al menos 2 caracteres.");
            }
            if (datosAlumno.calle.length < 1 && regex.test(datosAlumno.calle)) {
                return ("La calle debe tener al menos 2 caracteres.");
            }
            if (!datosAlumno.numero) {
                return ("El número debe tener al menos 1 número.");
            }
        }



        return ""
    }

    function continuar() {

        if (selectedScreen === 0 && selectedCursosId.length === 0) return setError("Debe seleccionar al menos un taller");
        const err = validateDatos();
        if (err != "") return setError(err);
        setSelectedScreen(selectedScreen + 1)
    }
    /*
        model SolicitudMayores {
        id          Int       @id @default(autoincrement())
        solicitud   Solicitud @relation(fields: [solicitudId], references: [id])
        solicitudId Int       @unique
        alumno      Alumno    @relation(fields: [alumnoId], references: [id])
        alumnoId    Int
        //firmas
        firmaUsoImagenes String
        observacionesUsoImagenes String
        firmaReglamento String

        }
    */
    async function cargarSolicitud() {

        //crear solicitud
        const solicitud = await createSolicitud()

        //crear ubicaciones
        const pais = await addPais({ "nombre": datosAlumno.pais })
        const provincia = await addProvincias({ "nombre": datosAlumno.provincia, "nacionalidadId": pais.id })
        const localidad = await addLocalidad({ "nombre": datosAlumno.localidad, "provinciaId": provincia.id })
        const direccion = await addDireccion({ "calle": datosAlumno.calle, "numero": datosAlumno.numero, "localidadId": localidad.id })

        //alumno que pudo ser actualizado
        const newAlumno = {
            Id: Number(user?.id),
            nombre: datosAlumno.nombre,
            apellido: datosAlumno.apellido,
            dni: datosAlumno.dni,
            telefono: datosAlumno.telefono,
            email: datosAlumno.correoElectronico,
            direccionId: direccion.id,
        }
        const alumno = await updateAlumno(Number(newAlumno.Id), newAlumno)
        //si alumno es un string es un error
        if (typeof alumno === "string") return setError(alumno)

        //crear solicitud mayor
         await createSolicitudMayor({
            alumnoId: Number(user?.id),
            solicitudId: solicitud.id,
            firmaUsoImagenes: datosAutorizacionImage.firma.length > 0 ? `${user?.nombre} ${user?.apellido}`: "",
            observacionesUsoImagenes: datosAutorizacionImage.observaciones,
            firmaReglamento: `${user?.nombre} ${user?.apellido}`,
          });

//        console.log("X:::::",x)
        //crear curso solicitud y alumno_curso
        for (let i = 0; i < selectedCursosId.length; i++) {
            await createCursoSolicitud({
                "cursoId": selectedCursosId[i],
                "solicitudId": solicitud.id,
            })
            await createAlumno_Curso({
                "alumnoId": Number(user?.id),
                "cursoId": selectedCursosId[i],
            })
        }

    }
    //region return
    return (
        <main>
            <div className="relative bg-red-500 justify-between w-full p-4">
                <Navigate />
            </div>

            <div id='miDiv' style={{ height: (selectedScreen < 3 ? '60vh' : 'auto') }}>
                {selectedScreen === 0 && (
                    user ? (
                        <SeleccionTaller
                            edad={calcularEdad(user.fechaNacimiento)}
                            setSelectedCursosId={setSelectedCursosId}
                            selectedCursosId={selectedCursosId}
                        />
                    ) : (
                        <div>Cargando...</div>
                    )
                )}

                {selectedScreen === 1 && (
                    <DatosAlumno
                        setDatosAlumno={setDatosAlumno}
                        datosAlumno={datosAlumno}
                        setError={setError}
                    />
                )}
                {selectedScreen === 2 && (
                    <AutorizacionImg
                        setDatosAutorizacionImage={setDatosAutorizacionImage}
                    />
                )}
                {selectedScreen === 3 && (
                    <Reglamentacion
                        setDatosReglamentacion={setDatosReglamentacion}
                    />
                )}
            </div>

            {selectedScreen < 3 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-6'
                            onClick={() => {
                                selectedScreen - 1 < 0
                                    ? window.location.href = "/usuario/Solicitud/Inscripcion"
                                    : setSelectedScreen(selectedScreen - 1);
                            }}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-4'
                            onClick={() => continuar()}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {selectedScreen === 3 && (
                <div className='p-5 w-full'>
                    <div className='flex mb-5 justify-center space-x-80'>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                            onClick={() => setSelectedScreen(selectedScreen - 1)}
                        >
                            Volver
                        </button>
                        <button
                            className='mx-2 py-2 text-white rounded bg-black px-5'
                            onClick={() =>{ 

                                if (datosReglamentacion.firma.length < 1 && selectedScreen === 3) return setError("Debe firmar la reglamentación");
                                setVerificarEmail(true);
                            }}
/*                             onClick={() => cargarSolicitud()} */
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            )}
            {verificarEmail && <div className=' absolute bg-slate-100 rounded-md shadow-md px-2 left-1/2 top-1/2 tranform -translate-x-1/2 -translate-y-1/2'>
                <button className='absolute top-2 right-2' onClick={() => setVerificarEmail(false)}>X</button>
                <EmailPage email={user.email} setCorrecto={setCorrecto} correcto={correcto} />
            </div>}
            {error != '' && <div className="absolute top-1/2 right-1/3 transform -translate-x-1/3 -translate-y-1/4 bg-white border p-4 rounded-md shadow-md w-96">
                <h2 className="text-lg font-bold text-red-600 mb-2">Error</h2>
                <p className="text-sm text-red-700 mb-4">{error}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                        onClick={() => setError('')}
                    >
                        Cerrar
                    </button>
                </div>
            </div>}
            <div className="py-5 border-t bg-white w-full" style={{ opacity: 0.66 }}>
                <But_aside />
            </div>
        </main>
    )
}
export default withAuthUser(Mayores);
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

import { getDireccionCompleta } from '@/services/ubicacion/direccion';
import { createSolicitudMayor } from '@/services/Solicitud/SolicitudMayor';
import { createSolicitud } from '@/services/Solicitud/Solicitud';
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import { getCursosByIdAlumno } from '@/services/alumno_curso';
import { createCursoSolicitud } from '@/services/curso_solicitud';
import { calcularEdad } from '@/helpers/fechas';
import { validateApellido, validateDireccion, validateDni, validateEmail, validateNombre, validatePhoneNumber } from '@/helpers/validaciones';
import Loader from '@/components/Loaders/loader/loader';

const Mayores: React.FC = () => {
    //region UseState

    // Estado para almacenar la pantalla actual
    const [selectedScreen, setSelectedScreen] = useState<number>(0);
    // Estado para almacenar los cursos seleccionados
    const [selectedCursosId, setSelectedCursosId] = useState<number[]>([]);
    const [cursosYaInscriptosId, setCursosYaInscriptosId] = useState<number[]>([]);
    const [cursosYaInscriptosName, setCursosYaInscriptosName] = useState<number[]>([]);

    const [direccionId, setDireccionId] = useState<number>(0);

    const [datosAlumno, setDatosAlumno] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        fechaNacimiento: new Date().toISOString().split('T')[0],
        correoElectronico: "",
        dni: 0,
        pais: "",
        provincia: "",
        localidad: "",
        calle: "",
        numero: 0,
    });
    const [datosAlumnoCopia, setDatosAlumnoCopia] = useState({
        nombre: "",
        apellido: "",
        telefono: 0,
        fechaNacimiento: new Date().toISOString().split('T')[0],
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

    const [verifi, setVerifi] = useState(false);
    const [steps, setStep] = useState({
        stepsItems: ["Talleres", "Datos alumno", "Uso de Imagen", "Reglamentación"],
        currentStep: 1
    })

    useEffect(() => {
        if (!user) {
            const authorizeAndFetchData = async () => {
                // Primero verifico que el user esté logeado

                // Una vez autorizado obtengo los datos del user y seteo el email

                const user = await fetchUserData();
                const edad = calcularEdad(user.fechaNacimiento);
                if (edad < 18) {
                    window.location.href = "/usuario/Solicitud/Inscripcion"
                }
            };
            authorizeAndFetchData();
        };
    }, [user]);
    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        if (!user) {
            const authorizeAndFetchData = async () => {
                // Primero verifico que el user esté logeado
                //console.log("router", router);
                await autorizarUser(router);
                // Una vez autorizado obtengo los datos del user y seteo el email
                const user = await fetchUserData();

                const curYaInscriptos = await getCursosByIdAlumno(user.id);
                const curYaInscriptosId = curYaInscriptos.map((curso) => curso.id);
                const curYaInscriptosName = curYaInscriptos.map((curso) => curso.nombre);
                setCursosYaInscriptosId(curYaInscriptosId);
                setCursosYaInscriptosName(curYaInscriptosName);

                console.log("user", user);
                if (user) {
                    setUser(user);
                }
            };

            authorizeAndFetchData();
        }
    }, [router]);

    useEffect(() => {
        if (correcto) {
            console.log("0.CARGANDO SOLICITUD")
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
                let direccion, localidad, provincia, pais;
                if (user.direccionId) {
                    direccion = await getDireccionCompleta(user.direccionId);
                    localidad = direccion?.localidad;
                    provincia = localidad?.provincia;
                    pais = provincia?.nacionalidad;
                }
                if (direccion) setDireccionId((direccion.id));
                setDatosAlumno({
                    nombre: user.nombre,
                    apellido: user.apellido,
                    telefono: user.telefono,
                    correoElectronico: user.email,
                    fechaNacimiento: new Date(user.fechaNacimiento).toISOString().split('T')[0],
                    dni: user.dni,
                    pais: pais?.nombre || "",
                    provincia: provincia?.nombre || "",
                    localidad: (localidad?.nombre) || "",
                    calle: direccion?.calle || "",
                    numero: direccion?.numero || 0,
                })
                setDatosAlumnoCopia({
                    nombre: user.nombre,
                    apellido: user.apellido,
                    telefono: user.telefono,
                    correoElectronico: user.email,
                    fechaNacimiento: new Date(user.fechaNacimiento).toISOString().split('T')[0],
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
    /*     function validateDatos() {
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
        } */
    //region validate 
    async function validatealumnoDetails() {
        console.log(cursosYaInscriptosName, selectedCursosId)
        const { nombre, apellido, telefono, dni, correoElectronico,
            pais, provincia, localidad, calle, numero } = datosAlumno || {};

        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (selectedScreen === 0 && selectedCursosId.length === 0) return "Debe seleccionar al menos un taller";
        if (selectedScreen === 0 && selectedCursosId.some(id => cursosYaInscriptosId.includes(id))) {
            return "Ya se encuentra inscripto en uno de los talleres seleccionados (sus talleres: " + cursosYaInscriptosName.join(", ") + ").";
        }

        if (selectedScreen === 1) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(correoElectronico);
            if (resultValidate) return resultValidate;

            resultValidate = validateDni(String(dni));
            if (resultValidate) return resultValidate;

            if (!telefono) {
                return "El teléfono no puede estar vacío";
            }
            resultValidate = validatePhoneNumber(String(telefono));
            if (resultValidate) return resultValidate;

            resultValidate = validateDireccion(pais, provincia, localidad, String(calle), Number(numero));
            if (resultValidate) return resultValidate

            if (JSON.stringify(datosAlumno) !== JSON.stringify(datosAlumnoCopia)) {
                return 'Los datos del alumno no son los mismos que los registrados en el sistema. Por favor, actualíselos en "Mi cuenta" antes de continuar.';
            }
        }
        return "";
    }

    async function continuar() {

        if (selectedScreen === 0 && selectedCursosId.length === 0) return setError("Debe seleccionar al menos un taller");
        const err = await validatealumnoDetails();
        if (err != "") return setError(err);
        setSelectedScreen(selectedScreen + 1)
        setStep({ ...steps, currentStep: steps.currentStep + 1 });
        //console.log("selectedScreen::::", selectedScreen)
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
        // console.log("CARGANDO SOLICITUD")
        //crear solicitud
        const solicitud = await createSolicitud()


        //crear solicitud mayor
        await createSolicitudMayor({
            alumnoId: Number(user?.id),
            solicitudId: solicitud.id,
            firmaUsoImagenes: datosAutorizacionImage.firma.length > 0 ? `${user?.nombre} ${user?.apellido}` : "",
            observacionesUsoImagenes: datosAutorizacionImage.observaciones,
            firmaReglamento: `${user?.nombre} ${user?.apellido}`,
        });

        // console.log("SoliciMayor:::::", x)
        //crear curso solicitud y alumno_curso
        for (let i = 0; i < selectedCursosId.length; i++) {
            await createCursoSolicitud({
                "cursoId": selectedCursosId[i],
                "solicitudId": solicitud.id,
            })
            /*             console.log("X:::::", x)
                        console.log("Y:::::", y) */
        }
        setCorrecto(false)
        setVerifi(false)
        window.location.href = "/usuario/principal"
    }
    //region return
    return (
        <main>
            <Navigate />
            <div className='p-4  mt-5'>
                <h3 className='p-2 shadow-md w-60'>Inscripción a talleres - Mayores</h3>
            </div>
            <div className="max-w-2xl mx-auto px-4 md:px-0 mb-5 ">
                <ul aria-label="Steps" className="items-center text-gray-600 font-medium md:flex">
                    {steps.stepsItems.map((item, idx) => (
                        <li aria-current={steps.currentStep == idx + 1 ? "step" : false} className="flex gap-x-3 md:flex-col md:flex-1 md:gap-x-0">
                            <div className="flex flex-col items-center md:flex-row md:flex-1">
                                <hr className={`w-full border hidden md:block ${idx == 0 ? "border-none" : steps.currentStep >= idx + 1 ? "border-indigo-600" : ""}`} />
                                <div className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${(steps.currentStep > idx + 1 ? "bg-indigo-600 border-indigo-600" : "") || (steps.currentStep == idx + 1 ? "border-indigo-600" : "")}`}>
                                    <span className={`w-2.5 h-2.5 rounded-full bg-indigo-600 ${steps.currentStep != idx + 1 ? "hidden" : ""}`}></span>
                                    {
                                        steps.currentStep > idx + 1 ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                        ) : ""
                                    }
                                </div>
                                <hr className={`h-12 border md:w-full md:h-auto ${(idx + 1 == steps.stepsItems.length ? "border-none" : "") || steps.currentStep > idx + 1 ? "border-indigo-600" : ""}`} />
                            </div>
                            <div className="h-8 flex justify-center items-center md:mt-3 md:h-auto">
                                <h3 className={`text-sm ${steps.currentStep == idx + 1 ? "text-indigo-600" : ""}`}>
                                    {item}
                                </h3>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div id='miDiv' className='' style={{ height: "80vh" }}>
                {selectedScreen === 0 && (
                    (user && cursosYaInscriptosId.length !== 0) ? (
                        <SeleccionTaller
                            edad={calcularEdad(user.fechaNacimiento)}
                            setSelectedCursosId={setSelectedCursosId}
                            selectedCursosId={selectedCursosId}
                            alumnoId={user.id}
                        />
                    ) :
                        <div className=' w-full justify-center items-center align-middle flex'>
                            <Loader />
                        </div>

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
                {selectedScreen === 0 && (
                    (user && cursosYaInscriptosId.length !== 0) && (
                        <div className='p-5 w-full'>
                            <div className='flex mb-5 justify-center   space-x-80'>
                                <button
                                    className='mx-2 py-2 text-white rounded bg-black px-6'
                                    onClick={() => {
                                        selectedScreen - 1 < 0
                                            ? window.location.href = "/usuario/Solicitud/Inscripcion"
                                            : (setSelectedScreen(selectedScreen - 1), setStep({ ...steps, currentStep: steps.currentStep - 1 }));
                                    }}
                                >
                                    Volver
                                </button>
                                <button
                                    className='mx-2 py-2 text-white rounded bg-black px-4'
                                    onClick={() => { continuar(); }}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>)

                )}
                {(selectedScreen < 3 && selectedScreen !== 0) && ((
                    <>
                        <div className='p-5 w-full'>
                            <div className='flex mb-5 justify-center   space-x-80'>
                                <button
                                    className='mx-2 py-2 text-white rounded bg-black px-6'
                                    onClick={() => {
                                        selectedScreen - 1 < 0
                                            ? window.location.href = "/usuario/Solicitud/Inscripcion"
                                            : (setSelectedScreen(selectedScreen - 1), setStep({ ...steps, currentStep: steps.currentStep - 1 }));
                                    }}
                                >
                                    Volver
                                </button>
                                <button
                                    className='mx-2 py-2 text-white rounded bg-black px-4'
                                    onClick={() => { continuar(); }}
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    </>)
                )}

                {selectedScreen === 3 && (
                    <div className=' w-full'>
                        <div className='flex mb-5 justify-center -translate-y-40 space-x-80'>
                            <button
                                className='mx-2 py-2 text-white rounded bg-black px-5'
                                onClick={() => { setSelectedScreen(selectedScreen - 1); setStep({ ...steps, currentStep: steps.currentStep - 1 }) }}
                            >
                                Volver
                            </button>
                            <button
                                className='mx-2  py-2 text-white rounded bg-black px-5'
                                onClick={() => {

                                    if (datosReglamentacion.firma.length < 1 && selectedScreen === 3) return setError("Debe firmar la reglamentación");
                                    setVerificarEmail(true);
                                }}
                            /*    onClick={() => cargarSolicitud()} */
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {verificarEmail && <div className=' absolute bg-slate-100 rounded-md shadow-md px-2 left-1/2 top-1/2 tranform -translate-x-1/2 -translate-y-1/2'>
                <button className='absolute top-2 right-2' onClick={() => setVerificarEmail(false)}>X</button>
                <EmailPage email={user.email} setVerifi={setVerifi} setCorrecto={setCorrecto} correcto={correcto} />
            </div>}
            {verifi && (correcto ?
                (<h1 className=' absolute top-1/2 text-xl font-semibold' style={{ color: "green" }}>Se ha enviado la solicitud de inscripción correctamente!</h1>)
                :
                (<h1 className=' absolute top-1/2 text-xl font-semibold' style={{ color: "red" }}>No se pudo generar la solicitud de inscripción!</h1>)
            )}
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

            <div
                className="fixed bottom-0   border-t w-full z-30"
                style={{ background: "#EF4444" }}
            >
                <But_aside />
            </div>

        </main>
    )
}
export default Mayores;
"use client"
import React, { useRef, useState, useEffect, use } from 'react';
import Background from "../../../../public/Images/Background.jpeg";
import But_aside from "../../../components/but_aside/page";
import Image from "next/image";
import Navigate from "../../../components/profesional/navigate/page";
import { addDireccion, getDireccionById, getDireccionCompleta, updateDireccionById } from '@/services/ubicacion/direccion';
import { addProvincias, getProvinciasById, updateProvinciaById } from '@/services/ubicacion/provincia';
import { addLocalidad, getLocalidadById, getLocalidadesByProvinciaId, updateLocalidad } from '@/services/ubicacion/localidad';
import { addPais, getPaisById } from '@/services/ubicacion/pais';

import { Curso, getCursoById } from '@/services/cursos';
//import withAuthUser from "../../../components/profesional/userAuth";
import { useRouter } from 'next/navigation';
import { autorizarUser, fetchUserData } from '@/helpers/cookies';
import PasswordComponent from '@/components/Password/page';
import { getCursosByIdProfesional } from '@/services/profesional_curso';
import { updateProfesional } from '@/services/profesional';
import { validateApellido, validateDireccion, validateDni, validateEmail, validateNombre, validatePhoneNumber } from '@/helpers/validaciones';
import { emailExists } from '@/services/Alumno';
import Loader from '@/components/Loaders/loadingSave/page';
type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    email: string;
    /*     password: string; */
    rolId: number;
};

const Cuenta: React.FC = () => {
    //region UseStates
    // Estado para asegurar cambios, inicialmente 0
    const [openBox, setOpenBox] = useState<number>(0);

    // Estado para almacenar mensajes de error, inicialmente vacío
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Referencia para el contenedor de desplazamiento
    const scrollRef = useRef<HTMLDivElement>(null);

    // Estado para almacenar los datos del usuario, inicialmente nulo
    const [user, setUser] = useState<Usuario | null>();

    // Estado para almacenar los detalles del curso, inicialmente vacío
    const [profesionalDetails, setprofesionalDetails] = useState<{
        id: number; nombre: string; apellido: string;
        telefono: number; email: string; direccionId?: number; rolId?: number;
    }>({
        id: user?.id || 0,
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        telefono: user?.telefono || 0,
        email: user?.email || '',
        rolId: user?.rolId || 0
    });
    const [profesionalDetailsCopia, setprofesionalDetailsCopia] = useState<{
        id: number; nombre: string; apellido: string;
        telefono: number; email: string; rolId?: number;
    }>();

    // Estado para almacenar los cursos elegidos, inicialmente un array vacío
    const [cursosElegido, setCursosElegido] = useState<Curso[]>([]);
    //para obtener user by email

    const [habilitarCambioContraseña, setHabilitarCambioContraseña] = useState<boolean>(false);
    const [correcto, setCorrecto] = useState<boolean>(false);

    //listas de cursos
    const [cursos, setCursos] = useState<Curso[]>()

    const [isSaving, setIsSaving] = useState<boolean>(false);
    //endregion

    //region UseEffects
    // Función para obtener los datos del usuario

    const router = useRouter();
    useEffect(() => {
        if (user && !profesionalDetails.email) {
            getUser()
           
        }

    }, [user]);
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
        authorizeAndFetchData();
    }, [router]);

    const authorizeAndFetchData = async () => {
        
        await autorizarUser(router);
        
        const user = await fetchUserData();
        
        setUser(user)
        if (!user) return;
        let talleres = await getCursosByIdProfesional(Number(user?.id));
        console.log("talleres", talleres);
        setCursos([])
        talleres.map((curso) => {
            setCursos(prev => (prev ? [...prev, curso] : [curso]));
        })
        //console.timeEnd("authorizeAndFetchData");
    };
    useEffect(() => {
        if ((errorMessage.length > 0) && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [errorMessage]);

    useEffect(() => {
        if (errorMessage != null) {
            setInterval(() => {
                setErrorMessage("")
            }, 10000);
        }
    }, [errorMessage]);
    //endregion

    //region Funciones

    async function getUser() {

        console.log(user?.nombre);
        const userUpdate: Usuario = {
            id: user?.id || 0,
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            telefono: user?.telefono || 0,
            email: user?.email || '',
            /*             password: user?.password || '', */
            rolId: user?.rolId || 0
        }

        setprofesionalDetails({
            id: userUpdate.id,
            nombre: userUpdate.nombre, apellido: userUpdate.apellido,
            telefono: (userUpdate.telefono),
            email: userUpdate.email, rolId: userUpdate.rolId
        });
        setprofesionalDetailsCopia({
            id: userUpdate.id,
            nombre: userUpdate.nombre, apellido: userUpdate.apellido,
            telefono: (userUpdate.telefono),
            email: userUpdate.email, rolId: userUpdate.rolId
        });
        setUser(userUpdate);
        //setOpenBox(!openBox)

        //CARGAR TODAS LAS DIRECCIONES
    }
    //region validate
    async function validateProfesionalDetails() {
        const { nombre, apellido, email, telefono } = profesionalDetails || {};
        /*         if (JSON.stringify(alumnoDetails) === JSON.stringify(alumnoDetailsCopia)) {
                    return;
                } */
        console.log("responsableDetails", profesionalDetails);

        //validar que el nombre sea de al menos 2 caracteres y no contenga números
        let resultValidate;
        if (profesionalDetails) {
            resultValidate = validateNombre(nombre);
            if (resultValidate) return resultValidate;

            resultValidate = validateApellido(apellido);
            if (resultValidate) return resultValidate;

            resultValidate = validateEmail(email);
            if (resultValidate) return resultValidate;
            if (email !== profesionalDetailsCopia?.email) {
                const estado = await emailExists(email)
                if (estado) {
                    return "El email ya está registrado.";
                }
                if (resultValidate) return resultValidate;
            }

            if (telefono && typeof (telefono) === "number") {
                resultValidate = validatePhoneNumber(String(telefono));
                if (resultValidate) return resultValidate;

            }

        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setprofesionalDetails(prevDetails => ({
            ...prevDetails,
            [name]: (value)
        }));
    }

    async function handleSaveChanges() {

        const validationError = await validateProfesionalDetails();
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        // Crear un objeto con los campos necesarios, eliminando espacios al inicio y al final
        const trimmedProfesionalDetails = {
            nombre: profesionalDetails.nombre.trim(),
            apellido: profesionalDetails.apellido.trim(),
            email: profesionalDetails.email.trim(),
            telefono: profesionalDetails.telefono?.toString().trim(),

        };
        setIsSaving(true);
        if (JSON.stringify(profesionalDetails) !== JSON.stringify(profesionalDetailsCopia)) {
            setIsSaving(false);
            return
        }
        if (!profesionalDetails.direccionId) {
            console.log("profesionalDETAILS", profesionalDetails);
            const newprofesional = await updateProfesional(Number(profesionalDetails?.id), trimmedProfesionalDetails);
            if (typeof newprofesional === "string") return setErrorMessage(newprofesional);
            console.log("newprofesional", newprofesional);
        }

        try {
            console.log("profesionalDETAILS", profesionalDetails);
            const newprofesional = await updateProfesional(Number(profesionalDetails?.id), trimmedProfesionalDetails);
            console.log("newprofesional", newprofesional);
        } catch (error) {
            setErrorMessage("Ha ocurrido un error al guardar los cambios.");
        }

        setOpenBox(0);
        getUser();
        setIsSaving(false);
        authorizeAndFetchData();
        //console.log(openBox)

    }
    //endregion
    //region return
    return (
        <main style={{ fontFamily: "Cursive" }}>
            <Navigate />
            {/*            <div className="fixed inset-0 z-[-1]">
                <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            </div> */}
            <div className='absolute mt-20 top-5 '>
                <h1 className='flex my-20 items-center justify-center  font-bold text-3xl'>Datos del Profesional</h1>
                <div className='flex  justify-center w-screen'>
                    <div className=" mx-auto bg-gray-100 rounded-lg shadow-md px-8 py-6 grid grid-cols-2 gap-x-12 w-8/12">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Nombre:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.nombre} {user?.apellido}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Talleres:</label>
                            {cursos?.length !== 0 ? (
                                <p className="p-2 border rounded bg-gray-100" style={{ height: '10vh', overflow: "auto" }}> {cursos?.map((curso) => curso.nombre).join(", ")}</p>
                            ) : <p className="p-2 border rounded bg-gray-100">Talleres no cargados</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Teléfono:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.telefono ? user?.telefono : "Teléfono no cargado"}</p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Email:</label>
                            <p className="p-2 border rounded bg-gray-100">{user?.email}</p>
                        </div>

                        {/* 
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">password:</label>
                            <p className="p-2 border rounded bg-gray-100">
                                <input
                                    type="password"
                                    value={user?.password}
                                    className="w-full bg-transparent border-none"
                                    readOnly
                                />
                            </p>
                        </div> */}
                    </div>
                </div>
                <div className="flex items-center justify-center mt-5">
                    <button
                        className='bg-red-500 py-2 px-10 text-white rounded hover:bg-red-700'
                        onClick={() => { setOpenBox(1); console.log(openBox); getUser() }}>
                        Editar
                    </button>
                </div>
            </div>
            {openBox === 1 && (
                <div className="fixed inset-0 flex items-center w-600 justify-center bg-black bg-opacity-50">
                    <div ref={scrollRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative" style={{ height: '70vh', overflow: "auto" }}>
                        <h2 className="text-2xl font-bold mb-4">
                            Datos del Profesional
                        </h2>
                        {errorMessage && (
                            <div className="mb-4 text-red-600">
                                {errorMessage}
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="nombre" >Nombre:</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={profesionalDetails.nombre}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="apellido" className="block">Apellido:</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={(profesionalDetails.apellido)}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block">Email:</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={(profesionalDetails.email)}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="imagen" className="block">Imagen:</label>
                            <input
                                type="file"
                                id="imagen"
                                name="imagen"
                                className="p-2 w-full border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="telefono" className="block">Teléfono:</label>
                            <input
                                type="number"
                                id="telefono"
                                name="telefono"
                                value={profesionalDetails.telefono}
                                onChange={handleChange}
                                className="p-2 w-full border rounded"
                            />
                        </div>


                        <div>
                            <button
                                className="py-2  text-black font-bold rounded hover:underline"
                                onClick={() => setHabilitarCambioContraseña(!habilitarCambioContraseña)}
                            >
                                Cambiar contraseña
                            </button>
                            {habilitarCambioContraseña && <div className=' absolute bg-slate-100 rounded-md shadow-md px-2 left-1/2 top-1/2 tranform -translate-x-1/2 -translate-y-1/2'>
                                <button className='absolute top-2 right-2' onClick={() => setHabilitarCambioContraseña(false)}>X</button>
                                <PasswordComponent setCorrecto={setCorrecto} correcto={correcto} />
                            </div>}
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => { handleSaveChanges(); console.log("openBox", openBox) }}
                                className="bg-red-700 py-2 px-5 text-white rounded hover:bg-red-800"
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader /> : "Guardar"}
                            </button>
                            <button
                                onClick={() => { setOpenBox(0); console.log(openBox) }}
                                className="bg-gray-700 py-2 px-5 text-white rounded hover:bg-gray-800"
                                disabled={isSaving}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}
export default (Cuenta);
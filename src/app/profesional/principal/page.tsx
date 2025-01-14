"use client"
import React, { useEffect, useState } from 'react';
import Navigate from "../../../components/profesional//navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getCursosByIdAlumno } from '@/services/alumno_curso';
import Background from "../../../../public/Images/BackProfesionales.jpg"
import { getCursoById } from '@/services/cursos';
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
import { getCursosByIdProfesional } from '@/services/profesional_curso';
import { Profesional } from '@/services/profesional';
import { getImages_talleresAdmin } from "@/services/repoImage";
import { mapearImagenes } from "@/helpers/repoImages";
import NoImage from "../../../../public/Images/default-no-image.png";
import Talleres from '@/components/talleres/page';



type Usuario = {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    email: string;
    direccionId: number;
    rolId: number;
};

interface Curso {
    id: number;
    nombre: string;
    imageUrl?: string;
    imagen: string | null;
  }

const principal: React.FC = () => {

    const [cursos, setCursos] = useState<Curso[]>([]);
    const [userName, setUserName] = useState<string>('');

    const [email, setEmail] = useState<string>('');
    const [usuario, setUsuario] = useState<Usuario>();

    const [images, setImages] = useState<any[]>([]);
    const [downloadurls, setDownloadurls] = useState<any[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [loading, setLoading] = useState(true); // Estado de carga
    const router = useRouter();
    // Para cambiar al usuario de página si no está logeado
    // Para cambiar al usuario de página si no está logeado
    useEffect(() => {
      const verificarAutenticacion = async () => {
        try {
          setLoading(true);
          await autorizarUser(router); // Verifica si el usuario está autorizado
          const user = await fetchUserData(); // Obtén los datos del usuario
  
            if (!user) {
            router.push("/start/login"); // Redirige al login si no hay usuario
            return;
          }
  
          setUsuario(user);
  
          const talleres = await getCursosByIdProfesional(Number(user.id)); // Obtén cursos
          setCursos(talleres);
        } catch (error) {
          console.error("Error al verificar autenticación:", error);
          router.push("/login"); // Redirige al login si ocurre un error
        } finally {
          setLoading(false);
        }
      };
  
      verificarAutenticacion();
    }, [router]);
  
    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
      
        </div>
      );
    }
  
    if (!usuario) {
      return null; // Esto es opcional, ya que el usuario será redirigido
    }
    const authorizeAndFetchData = async () => {
        console.time("authorizeAndFetchData");
        // Primero verifico que el user esté logeado
        //console.log("router", router);
        await autorizarUser(router);
        // Una vez autorizado obtengo los datos del user y seteo el email
        const user = await fetchUserData();
        //console.log("user", user);
        setUsuario(user)
        if (!user) return;
        let talleres = await getCursosByIdProfesional(Number(user?.id));
        console.log("talleres", talleres, usuario?.id);
        setCursos([])

        talleres.map((curso) => {
            setCursos(prev => (prev ? [...prev, curso as Curso] : [curso as Curso]));
        })
        //console.timeEnd("authorizeAndFetchData");
    };



    const fetchImages = async (talleres: Curso[]) => {
        const result = await getImages_talleresAdmin();
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          setImages(result.images);
          const updatedCursos = mapearImagenes(talleres, {
            images: result.images,
            downloadurls: result.downloadurls,
          });
          updatedCursos.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setCursos(updatedCursos);
          setImagesLoaded(true);
        }
      };



      return (
        <main
          className="flex flex-col min-h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(${Background.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Navigate />
          <div className="flex flex-col flex-grow bg-white/50 p-4">
            <div className="mt-15 text-center px-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
                Bienvenido de regreso, {usuario?.nombre} {usuario?.apellido}
              </h1>
    
              {/* Contenedor de talleres */}
              <div className="flex flex-col items-center mt-10 px-4">
                <h1 className="text-lg md:text-xl font-bold">Mis Talleres</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6 max-w-screen-xl mx-auto">
                  {cursos.map((curso, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-4 w-full"
                    >
                      <img
                        src={curso.imageUrl || NoImage.src}
                        alt={String(curso.id)}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <h2 className="mt-2 text-center text-sm font-semibold">
                        {curso.nombre}
                      </h2>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      );
    };
    
    export default principal;

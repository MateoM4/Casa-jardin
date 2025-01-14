"use client";
import React, { useEffect, useState } from "react";
import Navigate from "../../../components/alumno/navigate/page";
import But_aside from "../../../components/but_aside/page";
import { getCursosByIdAlumno } from "@/services/alumno_curso";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { autorizarUser, fetchUserData } from "@/helpers/cookies";
import withAuthUser from "../../../components/alumno/userAuth";
import { getImages_talleresAdmin } from "@/services/repoImage";
import { mapearImagenes } from "@/helpers/repoImages";
import NoImage from "../../../../public/Images/default-no-image.png";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: number;
  email: string;
  direccionId: number;
  fechaNacimiento: string;
  rolId: number;
};

interface Curso {
  id: number;
  nombre: string;
  imageUrl?: string;
  imagen: string | null;
}

const Principal: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [images, setImages] = useState<any[]>([]);
  const [downloadurls, setDownloadurls] = useState<any[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario>();
  const router = useRouter();

  useEffect(() => {
    const authorizeAndFetchData = async () => {
      await autorizarUser(router);
      const user = await fetchUserData();
      setUsuario(user);
      setUserName(user?.nombre + " " + user?.apellido);
      if (!user) return;
      let talleres = await getCursosByIdAlumno(Number(user?.id));
      setCursos(talleres);
      fetchImages(talleres);
    };

    authorizeAndFetchData();
  }, [router]);

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
    {/* Navegación */}
    <Navigate />
  
    {/* Contenido */}
    <div className="flex flex-col flex-grow bg-white/50 p-4">
      {/* Bienvenida */}
      <div className="mt-24 text-center px-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold">
          Bienvenido de regreso, {userName}
        </h1>
      </div>
  
      {/* Lista de talleres */}
      <div className="flex flex-col items-center mt-10 px-4">
        <h1 className="text-lg md:text-xl font-bold">Mis Talleres</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {cursos.map((curso, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-4 w-full max-w-xs"
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
  
    {/* Botón fijo en la parte inferior */}
    <div
      className="fixed bottom-0 py-2 border-t w-full z-30 bg-sky-600"
    >
      <But_aside />
    </div>
  </main>
  );
};

export default withAuthUser(Principal);
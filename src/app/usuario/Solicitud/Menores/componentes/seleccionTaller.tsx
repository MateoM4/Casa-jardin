"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { cn } from "@/lib/utils";
import NoImage from "../../../../../../public/Images/default-no-image.png";
import { getImages_talleresAdmin } from '@/services/repoImage';
import { getCursosDisponiblesAlumno } from '@/services/cursos';
import Loader from '@/components/Loaders/loader/loader';

interface Datos {
    setSelectedCursosId: React.Dispatch<React.SetStateAction<number[]>>;
    selectedCursosId: number[];
    edad: number;
    alumnoId: number;
}

const SeleccionTaller: React.FC<Datos> = ({ setSelectedCursosId, selectedCursosId, edad, alumnoId}) => {
    const [cursos, setCursos] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [images, setImages] = useState<any[]>([]);
    const [downloadurls, setDownloadurls] = useState<any[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        fetchCursos();
        fetchImages();
    }, []);

    const fetchImages = async () => {
        const result = await getImages_talleresAdmin();
        if (result.error) {
            setErrorMessage(result.error)
        } else {
            setImages(result.images);
            setDownloadurls(result.downloadurls);
            if(cursos.length > 0){
                setLoaded(true);
            }
        }
        setLoaded(true);
    };

    async function fetchCursos() {
        try {
            let curs = await getCursosDisponiblesAlumno(edad, alumnoId)
            setCursos(curs);
            if(curs.length === 0){
                setErrorMessage("No hay cursos más talleres disponibles. Esto puede deberse a que ya se encuentran inscriptos en todos los talleres disponibles o no hay talleres disponibles para su edad.")
                setLoaded(true);
            }
        } catch (error) {
            console.error("Imposible obtener cursos", error);
        }
    }

    const handleButtonClick = (id: number) => {
        setSelectedCursosId(prevSelectedCursoId => {
            if (prevSelectedCursoId.includes(id)) {
                return prevSelectedCursoId.filter(prevId => prevId !== id);
            } else {
                return [...prevSelectedCursoId, id];
            }
        });
    };

    if (!loaded) {
        return (
            <div className="min-h-[500px] w-full flex items-center justify-center">
                <Loader/>
            </div>
        );
    }

    if (cursos.length === 0) {
        return (
            <div className="min-h-[500px] w-full flex flex-col items-center justify-center p-8">
                <div className="max-w-2xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay talleres disponibles</h2>
                    <p className="text-gray-600">{errorMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Elija los talleres de interés
                </h1>
                <p className="text-gray-600">
                    Seleccione los talleres en los que desea participar
                </p>
            </div>

            <div className="relative flex items-center justify-center gap-4">
                <button
                    className="flex-none p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => document.getElementById('scrollable-div')?.scrollBy({ left: -300, behavior: 'smooth' })}
                    aria-label="Scroll left"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <div
                    id="scrollable-div"
                    className="flex overflow-x-auto gap-6 py-4 px-2 snap-x snap-mandatory scrollbar-hide"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {cursos.map((curso, index) => (
                        <div
                            key={curso.id}
                            className="snap-center"
                        >
                            <button
                                onClick={() => handleButtonClick(curso.id)}
                                className={cn(
                                    "group relative w-72 rounded-xl transition-all duration-300 transform hover:scale-105",
                                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                    selectedCursosId?.includes(curso.id)
                                        ? "ring-2 ring-blue-500 ring-offset-2"
                                        : "hover:shadow-xl"
                                )}
                            >
                                <div className="aspect-[4/3] relative rounded-t-xl overflow-hidden">
                                    <Image
                                        src={downloadurls[index] || NoImage}
                                        alt={curso.nombre}
                                        layout="fill"
                                        objectFit="cover"
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className={cn(
                                        "absolute inset-0 transition-opacity duration-300",
                                        selectedCursosId?.includes(curso.id)
                                            ? "bg-blue-500/20"
                                            : "group-hover:bg-black/10"
                                    )} />
                                </div>
                                <div className={cn(
                                    "p-4 rounded-b-xl transition-colors duration-300",
                                    selectedCursosId?.includes(curso.id)
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-900 group-hover:bg-gray-50"
                                )}>
                                    <h3 className="text-lg font-semibold text-center">
                                        {curso.nombre}
                                    </h3>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                <button
                    className="flex-none p-3 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => document.getElementById('scrollable-div')?.scrollBy({ left: 300, behavior: 'smooth' })}
                    aria-label="Scroll right"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default SeleccionTaller;
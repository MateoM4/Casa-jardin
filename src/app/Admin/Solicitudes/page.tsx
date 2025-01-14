"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import Navigate from "@/components/Admin/navigate/page";

import { SolicitudMayor } from "@/services/Solicitud/SolicitudMayor";
import { deleteSolicitud, Solicitud, } from "@/services/Solicitud/Solicitud";
import { SolicitudMenores } from "@/services/Solicitud/SolicitudMenor";
import Background from "../../../../public/Images/BackgroundSolicitudes.jpg";
import Loader from "@/components/Loaders/loader/loader";


//nuevas llamadas
import { getSolicitudesCompletas } from "@/services/Solicitud/Solicitud";


//front
import { Smile, Baby, XCircle} from "lucide-react";
import { DashboardCard } from "@/components/varios/DashboardCard";
import SolicitudMayoresCard from "@/components/Admin/solicitudes/SolicitudMayoresCard";
import SolicitudMenoresCard from "@/components/Admin/solicitudes/SolicitudMenoresCard";
import { SolicitudEmailForm } from "@/components/Admin/solicitudes/solicitudEmailForm";

// para la tabla
import { SolicitudData, createColumns } from "@/components/Admin/solicitudes/column";
import { DataTable } from "@/components/Admin/solicitudes/data-table";
import { Button } from "@/components/ui/button";


const solicitudPage: React.FC = () => {
    // Estado para almacenar las solicitudes de mayores
    const [solicitudesMayores, setSolicitudesMayores] = useState<SolicitudMayor[]>([]);
    // Estado para almacenar las solicitud de menores
    const [solicitudesMenores, setSolicitudesMenores] = useState<SolicitudMenores[]>([]);
    // Estado para almacenar las solicitudes todas
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    // Estado para habilitar solicitudes de mayores
    const [habilitarMayores, setHabilitarMayores] = useState<boolean>(false);
    // Estado para habilitar solicitudes de menores
    const [habilitarMenores, setHabilitarMenores] = useState<boolean>(false);

    const [firmaUsoImagenes, setFirmaUsoImagenes] = useState<string>("");
    const [observacionesUsoImagenes, setObservacionesUsoImagenes] = useState<string>("");
    const [firmaReglamento, setFirmaReglamento] = useState<string>("");
    

    const [alumnosMayores, setAlumnosMayores] = useState<any[]>()
    const [alumnosMenores, setAlumnosMenores] = useState<any[]>()
    const [responsables, setResponsables] = useState<any[]>()
    const [loading, setLoading] = useState<boolean>(true);

    //para las solicitudes no leidas
    const [soliMayoresNoLeidas, setSoliMayoresNoLeidas] = useState<number>(0);
    const [soliMenoresNoLeidas, setSoliMenoresNoLeidas] = useState<number>(0);

    //para las solicitudes filtradas
    const [mayoresColData, setMayoresColData] = useState<SolicitudData[]>([]);
    const [menoresColData, setMenoresColData] = useState<SolicitudData[]>([])

    //para almacenar los cursos que trae la llamada
    const [cursos, setCursos] = useState<any[]>([]);

    //para cuando se selecciona una solicitud
    const [mayor, setMayor] = useState<boolean>(false);
    const [leida, setLeida] = useState<boolean>(false);
    const [solicitudIdSelected, setSolicitudIdSelected] = useState<number>(0);
    const [alumnoSelected, setAlumnoSelected] = useState<any>(null);
    const [responsableSelected, setResponsableSelected] = useState<any>();
    const [cursosSelected, setCursosSelected] = useState<any[]>([]);
    const [showSelect, setShowSelect] = useState(false);
    const [solicitudSelectedData, setSolitudSelectedData] = useState<any>(null);

    //para el ultimo componente, que abre el modal para accept o reject
    const [manejarSolitud, setManejarSolicitud] = useState<boolean>(false);
    const [aceptar, setAceptar] = useState<boolean>(false);
    const [solicitudAlumnoMap, setSolicitudAlumnoMapping] = useState<{ [key: number]: any }>({});



    useEffect(() => {
        const fetchDataIfNeeded = async () => {
            setLoading(true);
            if (solicitudes.length === 0) {
                await fetchData();
            }
            
            setLoading(false);
        };
        fetchDataIfNeeded();
    }, []);

    useEffect(() => {
      if(solicitudes){
      contarSolicitudesNoLeidas();
      }
    }, [solicitudesMayores, solicitudesMenores]);

    // Bloquear desplazamiento cuando los modales están activos
    useEffect(() => {
        if (habilitarMayores || habilitarMenores) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [habilitarMayores, habilitarMenores]);

    const fetchData = async () => {
        //hago la llamada a la base de datos
        const data = await getSolicitudesCompletas();
        console.log("DATA", data);
        //despues de obtener los datos, guardo los useStates correspondientes
      const soli: any = [];
      const soliMayores: any = [];
      const soliMenores: any = [];
      const alumnosMay: any = [];
      const alumnosMen: any = [];
      const responsables: any = [];
      const curs: any = [];
      const solicitudAlumnoMapping: { [key: number]: any } = {};

      data.forEach((solicitud) => {
        soli.push({
          //esto se utiliza para las columnas de la tabla
          id: solicitud.id,
          leida: solicitud.leida,
        });

        //esto ya es para para los datos de las solicitudes 
        if (solicitud.solicitudMayores) {
          soliMayores.push(solicitud.solicitudMayores);
          alumnosMay.push(solicitud.solicitudMayores.alumno);
          solicitudAlumnoMapping[solicitud.solicitudMayores.alumno.id] = solicitud.solicitudMayores.alumno;
        }

        if (solicitud.solicitudMenores) {
          soliMenores.push(solicitud.solicitudMenores);
          alumnosMen.push(solicitud.solicitudMenores.alumno);
          if (solicitud.solicitudMenores.alumno.responsable) {
            responsables.push(solicitud.solicitudMenores.alumno.responsable);
          }
        solicitudAlumnoMapping[solicitud.solicitudMenores.alumno.id] = solicitud.solicitudMenores.alumno;
        }
        curs.push(solicitud.cursoSolicitud);
      });

      console.log("1 SOLICITUDES", soli);
      console.log("2 SOLICITUDES MAYORES", soliMayores);
      console.log("3 SOLICITUDES MENORES", soliMenores);
      console.log("4 ALUMNOS MAYORES", alumnosMay);
      console.log("5 ALUMNOS MENORES", alumnosMen);
      console.log("6 RESPONSABLES", responsables);
      console.log("7 CURSOS", curs);


      setSolicitudes(soli);
      setSolicitudesMayores(soliMayores);
      setSolicitudesMenores(soliMenores);
      setAlumnosMayores(alumnosMay);
      setAlumnosMenores(alumnosMen);
      setResponsables(responsables);
      setCursos(curs)

        const mayoresData = soliMayores.map((solicitud: any) => {
            const s = soli.find((s: any) => s.id === solicitud.solicitudId);
            return {
            codigo: solicitud.solicitudId,
            alumno: solicitud.alumno ? solicitud.alumno.nombre + " " + solicitud.alumno.apellido : "Error: datos no disponibles",
            email: solicitud.alumno ? solicitud.alumno.email : "Error: datos no disponibles",
            estado: s?.leida ? "Leída" : "No leída",
            };
        });

        console.log("MAYORES DATA", mayoresData);
        setMayoresColData(mayoresData);

        const menoresData = soliMenores.map((solicitud: any) => {
            const s = soli.find((s: any) => s.id === solicitud.solicitudId);
            return {
            codigo: solicitud.solicitudId,
            alumno: solicitud.alumno ? solicitud.alumno.nombre + " " + solicitud.alumno.apellido : "Error: datos no disponibles",
            email: solicitud.alumno ? solicitud.alumno.email : "Error: datos no disponibles",
            estado: s.leida ? "Leída" : "No leída",
            };
        });

        console.log("MENORES DATA", menoresData);
        setMenoresColData(menoresData);
    }

    const contarSolicitudesNoLeidas = () => {
        const solicitudesNoLeidas = solicitudes.filter((solicitud) => !solicitud.leida);
        const soliMayoresNoLeid = solicitudesNoLeidas.filter((solicitud) => solicitudesMayores.some((data) => data.solicitudId === solicitud.id));
        setSoliMayoresNoLeidas(soliMayoresNoLeid.length);
        console.log("soli mayores no leidas: ",soliMayoresNoLeid);
        const soliMenoresNoLeid = solicitudesNoLeidas.filter((solicitud) => solicitudesMenores.some((data) => data.solicitudId === solicitud.id));
        setSoliMenoresNoLeidas(soliMenoresNoLeid.length);
        console.log("soli menores no leidas: ",soliMenoresNoLeid);
    }

    const handleEliminarSolicitud = async (solicitudId: number) => {
        //console.log(solicitudMenores);
        await deleteSolicitud(solicitudId);
        //console.log(soliElim);
        fetchData()
    }
    
    //creo las columnas para la tabla (las columnas de acciones)
    const handleVerDetalles = (solicitudId: number) => {
        setSolicitudIdSelected(solicitudId);
        //para tener la data de la solicitud
        const sol = solicitudesMayores.find((solicitud) => solicitud.solicitudId === solicitudId) || solicitudesMenores.find((solicitud) => solicitud.solicitudId === solicitudId);
        if (!sol) return;
        console.log("SOL", sol);
        //para tener la data del alumno
        console.log("ALUMNOSMAYORES", alumnosMayores)
        
        const al = alumnosMayores?.find((alumno) => alumno.id === sol.alumnoId) || alumnosMenores?.find((alumno) => alumno.id === sol.alumnoId);
        console.log("AL", al);
        if(al){
            setAlumnoSelected(al);
        }
        //fijar los cursos
        console.log("CURSOS", cursos);
        console.log("soli id", solicitudId);
        const flatCrusos = cursos.flat();
        const curs = flatCrusos.filter((curso) => curso.solicitudId === solicitudId);

        //cambiar estado leida si es necesario
        const s = solicitudes.find((solicitud) => solicitud.id === solicitudId);
        if (s) {
            setLeida(s.leida);
        }

        console.log("CURS", curs);
        setCursosSelected(curs);
        setFirmaUsoImagenes(sol.firmaUsoImagenes ? "Uso permitido" : "Uso denegado");
        setObservacionesUsoImagenes(sol.observacionesUsoImagenes ? sol.observacionesUsoImagenes : "No hay observaciones");
        setFirmaReglamento(sol.firmaReglamento ? "Firmado" : "No firmado");
        setSolitudSelectedData(sol);
        setShowSelect(true);
      };

    
    const columns = createColumns(handleVerDetalles, handleEliminarSolicitud);

    //region return
    return (
        <main
            className="relative min-h-screen bg-cover bg-center"
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Navegación */}
            <div className="fixed top-0 left-0 right-0 flex justify-between w-full z-50">
                <Navigate />
            </div>
            <div className="fixed inset-0 z-[-1]">
                <Image src={Background} alt="Background" layout="fill" objectFit="cover" quality={80} priority={true} />
            </div>
            {/* Contenido principal */}
            {!habilitarMayores && !habilitarMenores && (
                <div className="flex flex-col items-center justify-center min-h-screen relative z-10  ">
                    <div className= "py-2 px-4 justify-center items-center rounded-lg shadow-lg w-4/5 lg:w-1/2 md:w-2/3 sm:w-4/5">
                    <h1 className="text-3xl text-center text-gray-800 my-6">Solicitudes</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DashboardCard
                            title="Solicitudes Mayores"
                            description={soliMayoresNoLeidas > 0 ? `${soliMayoresNoLeidas} solicitudes pendientes` : "No hay solicitudes pendientes"}
                            icon={Smile}
                            onClick={() => {setHabilitarMayores(!habilitarMayores); setMayor(true)}}
                            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                            />
                            <DashboardCard
                            title="Solicitudes Menores"
                            description={soliMenoresNoLeidas > 0 ? `${soliMenoresNoLeidas} solicitudes pendientes` : "No hay solicitudes pendientes"}
                            icon={Baby}
                            onClick={() => {setHabilitarMenores(!habilitarMenores); setMayor(false)}}
                            gradient="bg-gradient-to-br from-purple-500 to-pink-600"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modales */}
            {(habilitarMayores) && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-10">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                    <h1 className="text-center mb-4">Historial de solicitudes Mayores</h1>
                    <button className="absolute top-2 right-2 p-1" onClick={() => { setHabilitarMayores(!habilitarMayores);}}>
                        <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                    </button>
                    <div className="p-4 space-y-4">
                        {loading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <Loader />
                            <h1>Cargando solicitudes</h1>
                        </div>
                        ) : (
                        <div className="container mx-auto py-3 overflow-x-auto">
                                <DataTable columns={columns} data={mayoresColData} />
                        </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {habilitarMenores && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-10">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                    <h1 className="text-center mb-4">Historial de solicitudes Menores</h1>
                    <button className="absolute top-2 right-2 p-1" onClick={() => { setHabilitarMenores(!habilitarMenores); setSolicitudIdSelected(0) }}>
                        <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                    </button>
                    <div className="p-4 space-y-4">
                        {loading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            <Loader />
                            <h1>Cargando solicitudes</h1>
                        </div>
                        ) : (
                        <div className="container mx-auto py-10 overflow-x-auto">
                                <DataTable columns={columns} data={menoresColData} />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSelect && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-30">
                    <div className="relative p-6 rounded shadow-md bg-white w-full" style={{ height: '70vh', overflow: 'auto', maxWidth: 'none' }}>
                        <h1 className="text-center mb-4">Detalles de la solicitud</h1>
                        <button className="absolute top-2 right-2 p-1" onClick={() => { setShowSelect(false); }}>
                            <XCircle className="w-6 h-6 text-gray-800 hover:text-red-500" />
                        </button>
                        <div className="p-4 space-y-4">
                            <div>
                                {mayor ? (
                                    <SolicitudMayoresCard
                                        data={{ 
                                            id: solicitudIdSelected, 
                                            cursoSolicitud: cursosSelected, 
                                            solicitudMayores: solicitudSelectedData 
                                        }}
                                    />
                                ) : (
                                    <SolicitudMenoresCard 
                                        data={{ 
                                            id: solicitudIdSelected, 
                                            cursoSolicitud: cursosSelected, 
                                            solicitudMenores: solicitudSelectedData 
                                        }}
                                    />
                                )}
                            </div>
                            {/* Botones de acción si la solicitud es No Leída*/}
                            { !leida && (
                                <div className="flex justify-center items-center space-x-4">
                                <Button className="bg-sky-600" onClick={() => {setManejarSolicitud(true); setAceptar(true)}}>Aceptar</Button>
                                <Button className="bg-red-600" onClick={() => {setManejarSolicitud(true); setAceptar(false)}}>Rechazar</Button>

                                {manejarSolitud && (
                                    aceptar ? (
                                        <SolicitudEmailForm
                                            soliAlumno={{solicitudId: solicitudIdSelected, alumno: alumnoSelected}}
                                            cursos={cursosSelected}
                                            aceptar={true}
                                            onSubmit={() => fetchData()}
                                            onClose={() =>{setManejarSolicitud(false), setShowSelect(false)}}
                                        />
                                    ) : (
                                        <SolicitudEmailForm
                                            soliAlumno={{solicitudId: solicitudIdSelected, alumno: alumnoSelected}}
                                            aceptar={false}
                                            onSubmit = {() => fetchData()}
                                            onClose={() =>{setManejarSolicitud(false), setShowSelect(false)}}
                                        />
                                    )
                                )} 
                                </div>
                            )}  
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

//export default withAuth(solicitudPage);
export default (solicitudPage);
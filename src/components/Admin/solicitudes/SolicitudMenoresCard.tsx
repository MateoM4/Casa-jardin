"use client"
import React, {useState, useEffect} from 'react';
import { Smile, User, Phone, MapPin, Heart, BookOpen, Camera, FileSignature, NotebookText, MoveRight} from 'lucide-react';
import { getDireccionCompleta } from '@/services/ubicacion/direccion';
import { getCursoById } from '@/services/cursos';


interface SolicitudCardProps {
  data: {
    id: number;
    cursoSolicitud:{
      id: number,
      solicitudId: number,
      cursoId: number,
      curso:{
        id: number,
        nombre: string,
      }
    }[],
    solicitudMenores: {
      alumno: {
        nombre: string;
        apellido: string;
        dni: number;
        direccionId: number;
        email: string;
        fechaNacimiento: Date;
        responsable: {
          nombre: string;
          apellido: string;
          direccionId: number;
          dni: number;
          email: string;
          telefono: string;
        };
      };
      alergia: string;
      enfermedad: string;
      especialista: string;
      medicacion: string;
      motivoAsistencia: string;
      terapia: string;
      firmaReglamento: string;
      firmaSalidas: string;
      firmaUsoImagenes: string;
      observacionesSalidas: string;
      observacionesUsoImagenes: string;
    };
  }
}

const SolicitudMenoresCard: React.FC<SolicitudCardProps> = ({ data }) => {
  const [cursos, setCursos] = useState<any>(["No se pudo cargar los cursos"]);
  const [direccionAlumno, setDireccionAlumno] = useState<any>("No se pudo cargar la dirección");
  const [direccionResponsable, setDireccionResponsable] = useState<any>("No se pudo cargar la dirección");
  const [loaded, setLoaded] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const alumno = data.solicitudMenores.alumno;
  const responsable = alumno.responsable


  useEffect(() => {
      if (!dataFetched) {
        console.log('Fetching data...');
        fetchData();
      }
    }, [dataFetched]); // Solo depende de dataFetched

  const fetchData = async () => {
  //  console.log('Flag 1');
    try {
    //  console.log('Flag 2');
      const [direccionAlumnoData, direccionResponsableData] = await Promise.all([
        getDireccionCompleta(alumno.direccionId),
        getDireccionCompleta(responsable.direccionId),
      ]);
  
    //  console.log('Dirección Alumno:', direccionAlumnoData);
    //  console.log('Dirección Responsable:', direccionResponsableData);
      
      const cur = data.cursoSolicitud.map(curso => ({
        cursoId: curso.cursoId,
        nombre: curso.curso.nombre
      }));
      setCursos(cur);
  
      
      const direccionAlumnoStr = `${direccionAlumnoData?.calle} ${direccionAlumnoData?.numero}, ${direccionAlumnoData?.localidad.nombre}, ${direccionAlumnoData?.localidad.provincia.nombre}, ${direccionAlumnoData?.localidad.provincia.nacionalidad.nombre}`;
      const direccionResponsableStr = `${direccionResponsableData?.calle} ${direccionResponsableData?.numero}, ${direccionResponsableData?.localidad.nombre}, ${direccionResponsableData?.localidad.provincia.nombre}, ${direccionResponsableData?.localidad.provincia.nacionalidad.nombre}`;
      
      setDireccionAlumno(direccionAlumnoStr);
      setDireccionResponsable(direccionResponsableStr);
      setLoaded(true);
      setDataFetched(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {loaded ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <NotebookText className="w-5 h-5" />
              Solicitud N° {data.id}
            </h2>
          </div>

          <div className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-2 gap-6 bg-sky-50">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <User className="w-5 h-5 text-sky-700" />
                Datos Personales</h3>

              <div className="mt-2 space-y-2">
                <p className="font-medium"><span className="font-semibold">Nombre:</span> {alumno.nombre} {alumno.apellido}</p>
                <p className="font-medium"><span className="font-semibold">DNI:</span> {alumno.dni}</p>
                <p className="font-medium"><span className="font-semibold">Email:</span> {alumno.email}</p>
                <p className="font-medium"><span className="font-semibold">Fecha de Nacimiento:</span> {new Date(alumno.fechaNacimiento).toLocaleDateString()}</p>
                <p className="font-medium"><span className="font-semibold">Dirección:</span> {direccionAlumno}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Información del Responsable
              </h3>
              <div className="mt-2 space-y-2">
                <p className="font-medium"><span className="font-semibold">Nombre:</span> {responsable.nombre} {responsable.apellido}</p>
                <p className="font-medium"><span className="font-semibold">DNI:</span> {responsable.dni}</p>
                <p className="font-medium"><span className="font-semibold">Email:</span> {responsable.email}</p>
                <p className="font-medium"><span className="font-semibold">Teléfono:</span> {responsable.telefono}</p>
                <p className="font-medium"><span className="font-semibold">Dirección:</span> {direccionResponsable}</p>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="bg-green-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                Información Médica
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="break-words font-medium"><span className="font-semibold">Alergias:</span> {data.solicitudMenores.alergia || 'No reportadas'}</p>
                  <p className="break-words font-medium"><span className="font-semibold">Enfermedades:</span> {data.solicitudMenores.enfermedad || 'No reportadas'}</p>
                  <p className="break-words font-medium"><span className="font-semibold">Medicación:</span> {data.solicitudMenores.medicacion || 'No reportada'}</p>
                </div>
                <div className="space-y-2">
                  <p className="break-words font-medium"><span className="font-semibold">Especialista:</span> {data.solicitudMenores.especialista || 'No reportado'}</p>
                  <p className="break-words font-medium"><span className="font-semibold">Terapia:</span> {data.solicitudMenores.terapia || 'No reportada'}</p>
                  <p className="break-words font-medium"><span className="font-semibold">Motivo de Asistencia:</span> {data.solicitudMenores.motivoAsistencia || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="bg-indigo-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Cursos seleccionados
              </h3>
              <div className="grid gap-4">
                {cursos.map((course: any, index: number) => (
                    <div key={`${course.id}-${index}`}>
                   <p className="break-words font-semibold flex items-center gap-2">
                        <MoveRight className="w-5 h-5" />{course.nombre}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t">
            <div className="bg-yellow-50 p-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-yellow-600" />
                Autorizaciones y Observaciones
              </h3>
              <div className="mt-2 space-y-2">
                <p className="break-words text-gray-600 font-semibold">Firma Reglamento: <span className="font-medium">{data.solicitudMenores.firmaReglamento ? 'De acuerdo' : 'Rechazado'}</span></p>
                <p className="break-words text-gray-600 font-semibold">Firma Salidas: <span className="font-medium">{data.solicitudMenores.firmaSalidas ? 'De acuerdo' : 'Rechazado'}</span></p>
                <p className="break-words text-gray-600 font-semibold">Firma Uso de Imágenes: <span className="font-medium">{data.solicitudMenores.firmaUsoImagenes ? 'De acuerdo' : 'Rechazado'}</span></p>
                <p className="break-words text-gray-600 font-semibold">Observaciones Salidas: <span className="font-medium">{data.solicitudMenores.observacionesSalidas || 'Sin observaciones'}</span></p>
                <p className="break-words text-gray-600 font-semibold">Observaciones Uso de Imágenes: <span className="font-medium">{data.solicitudMenores.observacionesUsoImagenes || 'Sin observaciones'}</span></p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <NotebookText className="w-6 h-6" />
              Información Solicitud {data.id}
            </h2>
          </div>
          <div className="p-6">
            <p>Cargando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudMenoresCard;


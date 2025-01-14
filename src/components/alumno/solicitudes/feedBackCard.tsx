import React, { useState, useEffect } from 'react';
import { CircleCheck, CircleX, AlertCircle } from 'lucide-react';

interface Props {
  cursoSolicitud: {
    id: number;
    solicitudId: number;
    cursoId: number;
    curso: {
      id: number;
      nombre: string;
    };
    estado: boolean;
  }[];
}

const FeedbackCard: React.FC<Props> = ({ cursoSolicitud }) => {
  const cursos = cursoSolicitud.map((curso) => curso.curso);
  const [aceptados, setAceptados] = useState(0);

  useEffect(() => {
    const totalAceptados = cursoSolicitud.filter(curso => curso.estado).length;
    setAceptados(totalAceptados);
  }, [cursoSolicitud]);

  const getCardStyle = () => {
    if (aceptados === 0) {
      return {
        header: 'bg-red-600',
        body: 'bg-red-50',
        icon: <CircleX className="w-6 h-6" />,
        title: 'Solicitud Rechazada',
      };
    } else if (aceptados === cursos.length) {
      return {
        header: 'bg-green-600',
        body: 'bg-green-50',
        icon: <CircleCheck className="w-6 h-6" />,
        title: 'Solicitud Aceptada',
      };
    } else {
      return {
        header: 'bg-yellow-600',
        body: 'bg-yellow-50',
        icon: <AlertCircle className="w-6 h-6" />,
        title: 'Solicitud Parcialmente Aceptada',
      };
    }
  };

  const cardStyle = getCardStyle();

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className={`${cardStyle.header} p-4 text-white`}>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {cardStyle.icon}
            {cardStyle.title}
          </h2>
        </div>

        <div className={`p-4 sm:p-6 ${cardStyle.body}`}>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700">
              Cursos Solicitados ({aceptados} de {cursos.length} aceptados)
            </h3>
            <div className="space-y-2">
              {cursoSolicitud.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-700">
                    {item.curso.nombre}
                  </span>
                  {item.estado ? (
                    <CircleCheck className="w-5 h-5 text-green-600" />
                  ) : (
                    <CircleX className="w-5 h-5 text-red-600" />
                  )}
                </div>
              ))}
            </div>
            <h3 className="font-semibold text-gray-700"> Debío haber recibido un email relacionado al estado su solicitud. </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
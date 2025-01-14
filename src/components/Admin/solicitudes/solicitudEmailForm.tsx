import React, {useState } from 'react';
import { X, Send, ChevronDown, ChevronUp, Wand2, Loader2 } from 'lucide-react';
import { updateSolicitud } from '@/services/Solicitud/Solicitud';
import { createAlumno_Curso } from '@/services/alumno_curso';
import { updateCursoSolicitud } from '@/services/curso_solicitud';
import { sendEmailCustom } from '@/helpers/sendmail';

interface SolicitudEmailFormProps {
  soliAlumno: {solicitudId: number, alumno: any};
  cursos?: any[];
  aceptar: boolean;
  onSubmit: (data: { selectedItems: string[]; title: string; body: string }) => void;
  onClose: () => void;
}

export function SolicitudEmailForm({soliAlumno, cursos, aceptar, onSubmit, onClose }: SolicitudEmailFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectCursosId, setSelectCursosId] = useState<number[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Add error states
  const [errors, setErrors] = useState({
    cursos: '',
    title: '',
    body: ''
  });
  
  const validateForm = () => {
    const newErrors = {
      cursos: '',
      title: '',
      body: ''
    };
    let isValid = true;

    if (cursos && selectedItems.length === 0) {
      newErrors.cursos = 'Debe seleccionar al menos un curso';
      isValid = false;
    }

    if (!title.trim()) {
      newErrors.title = 'El título del email no puede estar vacío';
      isValid = false;
    }

    if (!body.trim()) {
      newErrors.body = 'El contenido del email no puede estar vacío';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if(aceptar){
        await handleAceptarSolicitud(soliAlumno.solicitudId, soliAlumno.alumno.id, selectCursosId);
      }
      else{
        await handleRechazar(soliAlumno.solicitudId);
      }
      onSubmit({ selectedItems, title, body });
    } catch (error) {
      console.error('Error processing solicitud:', error);
      setSuccessMessage('Hubo un error al procesar la solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleItem = (itemId: number, itemName: string) => {
    setSelectedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(i => i !== itemName)
        : [...prev, itemName]
    );
    setSelectCursosId(prev =>
      prev.includes(itemId)
        ? prev.filter(i => i !== itemId)
        : [...prev, itemId]
    );
    if (errors.cursos) {
      setErrors(prev => ({ ...prev, cursos: '' }));
    }
  };

  const handleAutocomplete = () => {
    if(aceptar){
      setTitle('Solicitud de Inscripción Aprobada');
      const formattedItems = selectedItems.map(item => `- ${item}`).join('\n');
      setBody(`¡Hola ${soliAlumno.alumno.nombre}! Se le ha dado de alta correctamente en los siguientes cursos:\n
${formattedItems}\n
Te esperamos en Casa Jardín!`);
    }
    else{
      setTitle('Solicitud de Inscripción Rechazada');
      setBody(`¡Hola ${soliAlumno.alumno.nombre}! Lamentablemente, su solicitud de inscripción ha sido rechazada.\n
Por favor, póngase en contacto con nosotros para más información.\n
saludos cordiales, Casa Jardín`);
    }
    setErrors({
      cursos: '',
      title: '',
      body: ''
    });
  };

  const handleRechazar = async (solicitudId: number) => {
    try {
<<<<<<< HEAD
      await updateSolicitud(solicitudId, { leida: true, enEspera: true });
<<<<<<< Updated upstream
      await emailRechazo(correo, title, body);
      setSuccessMessage('La solicitud ha sido rechazada correctamente.');
=======
  
      const response = await sendEmailCustom(soliAlumno.alumno.email, title, body);
    
=======
      await updateSolicitud(solicitudId, {leida: true,});
      const response = await sendEmailCustom(soliAlumno.alumno.email, title, body);
      
>>>>>>> main
      if (response.ok) {
        setSuccessMessage('La solicitud ha sido rechazada correctamente.');
      } else {
        throw new Error('Error sending email');
      }
<<<<<<< HEAD

>>>>>>> Stashed changes
=======
>>>>>>> main
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    }
  };
  
  const handleAceptarSolicitud = async (solicitudId: number, idAlumno: number, cursosSeleccionados: number[]) => {
    try {
      await updateSolicitud(solicitudId, { leida: true,});
      for (let curso of cursosSeleccionados) {
        await createAlumno_Curso({
          "alumnoId": idAlumno,
          "cursoId": (curso),
        });
        //pone true a los cursos seleccionados
        await updateCursoSolicitud(curso, { estado: true });
      }
      
      const response = await sendEmailCustom(soliAlumno.alumno.email, title, body);
      
      if (response.ok) {
        setSuccessMessage('La solicitud ha sido aceptada correctamente.');
      } else {
        throw new Error('Error sending email');
      }
<<<<<<< HEAD
<<<<<<< Updated upstream
      await emailAceptar(soliAlumno.alumno.email, title, body);
      setSuccessMessage('La solicitud ha sido aceptada correctamente.');
=======
     
      const response = await sendEmailCustom(soliAlumno.alumno.email, title, body);
    
      if (response.ok) {
        setSuccessMessage('La solicitud ha sido aceptada correctamente.');
      } else {
        throw new Error('Error sending email');
      }
>>>>>>> Stashed changes
=======
>>>>>>> main
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 3000);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className={`p-4 border-b flex justify-between items-center ${aceptar ? 'bg-sky-600' : 'bg-red-600'}`}>
          <h2 className="text-xl font-semibold text-white">Manejo de Solicitud</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-700 transition-colors"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>
  
        {successMessage && (
          <div className="p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {cursos && (
            <div>
              <div
                className={`border rounded-lg p-2 cursor-pointer ${errors.cursos ? 'border-red-500' : ''}`}
                onClick={() => !isLoading && setIsOpen(!isOpen)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">
                    {selectedItems.length
                      ? `${selectedItems.length} Cursos seleccionados`
                      : 'Seleccione los cursos'}
                  </span>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              {errors.cursos && (
                <p className="mt-1 text-sm text-red-500">{errors.cursos}</p>
              )}
              
              {isOpen && (
                <div className="mt-2 border rounded-lg max-h-48 overflow-y-auto">
                  {cursos?.map((curso) => (
                    <div
                      key={curso.curso.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => !isLoading && toggleItem(curso.curso.id, curso.curso.nombre)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(curso.curso.nombre)}
                        onChange={() => !isLoading && toggleItem(curso.curso.id, curso.curso.nombre)}
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span>{curso.curso.nombre}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
  
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAutocomplete}
              className="text-blue-500 hover:text-blue-600 flex items-center space-x-1"
              disabled={isLoading}
            >
              <Wand2 size={16} />
              <span>Auto-completar</span>
            </button>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titulo Email
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: '' }));
                }
              }}
              className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter email title"
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto Email
            </label>
            <textarea
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) {
                  setErrors(prev => ({ ...prev, body: '' }));
                }
              }}
              className={`w-full p-2 border rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.body ? 'border-red-500' : ''}`}
              placeholder="Enter email body"
              disabled={isLoading}
            />
            {errors.body && (
              <p className="mt-1 text-sm text-red-500">{errors.body}</p>
            )}
          </div>
  
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                aceptar ? 'bg-sky-600 hover:bg-sky-950' : 'bg-red-600 hover:bg-red-950'
              } text-white px-4 py-2 rounded-lg flex items-center space-x-2 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>Enviar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
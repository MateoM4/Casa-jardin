"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { autorizarProfesional } from "../../helpers/cookies";// Asegúrate de que la ruta de importación sea correcta

const withAuthProfesional = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
      const authorize = async () => {
        setLoading(true);
        await autorizarProfesional(router);
        setLoading(false); // El usuario está autorizado, detener la carga
      };

      authorize();

      // Configurar intervalo para verificar la autenticación cada 15 minutos
      const interval = setInterval(async () => {
        await autorizarProfesional(router);
      }, 1800000); // 30 minutos en milisegundos (30 * 60 * 1000)

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }, [router]);

    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          {/* Aquí puedes agregar un spinner o un mensaje de carga */}
        </div>
      );
    }

    // Puedes pasar el email al WrappedComponent si es necesario
    return <WrappedComponent {...props}  />;
  };

  return AuthenticatedComponent;
};

export default withAuthProfesional;

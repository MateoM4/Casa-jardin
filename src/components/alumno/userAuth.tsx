"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { autorizarUser, fetchUserData } from "../../helpers/cookies";// Asegúrate de que la ruta de importación sea correcta

const withAuthUser = (WrappedComponent: React.ComponentType) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Estado de carga
  
    useEffect(() => {
      const authorize = async () => {
        setLoading(true);
        await autorizarUser(router);
        setLoading(false); // El usuario está autenticado 
      };
      authorize();

      // Configurar intervalo para verificar la autenticación cada 30 minutos
      const interval = setInterval(async () => {
        await autorizarUser(router);
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

export default withAuthUser;

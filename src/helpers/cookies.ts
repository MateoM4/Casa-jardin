
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";


//todos los metodos son del lado del cliente ya que usan llamadas a la api

//chequea si el user esta logeado
export const autorizarUser = async (router: AppRouterInstance) => {
    const response = await fetch("/api/auth", {
      method: "GET",
      credentials: "include",
    });
    //sino lo redirijo a la pagina de login
    if (response.status === 401) {
        router.push("/start/login");
    }
  };

//obtiene los datos del user
export async function fetchUserData() {
    try {
      const response = await fetch("/api/user", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        //console.log("User data:", data.user);
        //IMPORTANTE que se use data.user en lugar de solo data (xq asi lo trae la api)
        return data.user;
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
}

//verifica si el usuario logeado es un admin, sino lo redirige a la pagina de login
export const autorizarAdmin = async (router: AppRouterInstance) => {
    const response = await fetch("/api/admin", {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 401) {
        router.push("/start/login");
    }
};

//verifica si el usuario logeado es un profesional (tambien acepta admin), sino lo redirige a la pagina de login
export const autorizarProfesional = async (router: AppRouterInstance) => {
    const response = await fetch("/api/profesional", {
      method: "GET",
      credentials: "include",
    });
    if (response.status === 401) {
        router.push("/start/login");
    }
};
// Elimina una cookie en el cliente


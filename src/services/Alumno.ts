"use server"

import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "../helpers/hashPassword";

import { encrypt, getUserFromCookie } from "@/helpers/jwt";
import { cookies } from "next/headers";
const prisma = new PrismaClient();

// Definir el tipo Alumno
export type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  telefono: number;
  email: string;
  password: string;
  direccionId?: number;
  rolId: number;
  fechaNacimiento?: Date;
  mayoriaEdad?: boolean
};


// Crear Alumnos
export async function createAlumno(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono: number;
  direccionId?: number;
  fechaNacimiento?: Date;
  mayoriaEdad?: boolean

}) {
  // Verificar si el email ya existe en la base de datos
  const existingAlumno = await prisma.alumno.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingAlumno) {
    // El email ya existe
    return "El email ya está registrado";
  }

  // Encriptar la contraseña
  const hashedPassword = await hashPassword(data.password);

  // Crear el objeto de datos del alumno
  const alumnoData = {
    ...data,
    password: hashedPassword,
    rolId: 2
  };

  // Guardar el alumno
  const alum = await prisma.alumno.create({
    data: alumnoData,
  });
  return alum
}
export async function createAlumnoAdmin(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: number;
  direccionId?: number;
  dni: number;
  fechaNacimiento: Date;
  mayoriaEdad?: boolean;
  rolId: number;

}) {
  // Verificar si el email ya existe en la base de datos
  const existingAlumno = await prisma.alumno.findUnique({
    where: {
      email: data.email,
    },
  });
  data.fechaNacimiento = new Date(data.fechaNacimiento);
  if (existingAlumno) {
    // si ya existe que me actualice al alumno
    const { email, password, ...updateData } = data;
    //acutalizar el alumno sin cambiar el email y la contraseña
    console.log("ACTUALIZANDO ALUMNO EXISTENTE")
    return await prisma.alumno.update({
      where: { id: existingAlumno.id },
      data: updateData
    });
  }
  // Convertir fechaNacimiento a Date si está presente

//  console.log("fecha:", data.fechaNacimiento)
  console.log("CREANDO ALUMNO COMO ADMIN")
  // Guardar el alumno
  const alum = await prisma.alumno.create({
    data: data,
  });
  return alum
}




// valida los datos del alumno para iniciar sesión
export async function authenticateUser(email: string, password: string): Promise<number | null> {
  const tables = ['alumno', 'administrador', 'profesional'] as const;
  type Table = typeof tables[number];
  
  // Realiza búsquedas en paralelo para cada tabla y espera el primer resultado exitoso
  const userResults = await Promise.all(
    tables.map((table) => (prisma[table as Table] as any).findUnique({ where: { email } }))
  );

  // Busca el primer usuario que no sea null y verifique la contraseña
  for (const user of userResults) {
    if (user && await verifyPassword(password, user.password)) {
      // Crear sesión y establecer la cookie
      // La sesión expira en 30 minutos
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const session = await encrypt({ email: user.email, rolId: user.rolId, expires });
      cookies().set("user", session, { expires, httpOnly: true });

      return user.rolId; // Retorna el rol del usuario autenticado
    }
  }
  
  return null; // Devuelve null si no se encuentra usuario válido en ninguna tabla
}


// Modificar Alumno
export async function updateAlumno(id: number, data: {
  nombre: string;
  apellido: string;
  dni: number;
  telefono?: number;
  email: string;
  direccionId?: number;
  fechaNacimiento?: Date;
  mayoriaEdad?: Boolean

}) {
  // Verificar si el alumno existe
  const alumno = await prisma.alumno.findUnique({ where: { id } });
  if (!alumno) {
    throw new Error("El alumno no existe.");
  }
  if (data.fechaNacimiento) data.fechaNacimiento = new Date(data.fechaNacimiento);
  
  let alumnoData: any = {};

    // Actualizar el alumno
    alumnoData = {
    id: id,
    nombre: data.nombre,
    apellido: data.apellido,
    dni: (data.dni),
    telefono: data.telefono,
    direccionId: data.direccionId,
    email: data.email,
    fechaNacimiento: data.fechaNacimiento,
  }
  
  return await prisma.alumno.update({
    where: { id },
    data: alumnoData,
  });
}
//cambiar contraseña
export async function changePassword(password:string, newPassword:string, email:string) {
  console.log(password, newPassword, email);
  const alumno = await prisma.alumno.findUnique({ where: { email } });
  if (!alumno) {
    return "El alumno no existe.";
  }
  if (!await verifyPassword(password, alumno.password)) {
    return "Contraseña incorrecta.";
  }
  const hashedPassword = await hashPassword(newPassword);
  console.log("Se guardó correctamente la contraseña");
  return await prisma.alumno.update({
    where: { id: alumno.id },
    data: { password: hashedPassword },
  });
}
// Obtener Alumno por ID
export async function getAlumnoById(id: number) {
  return await prisma.alumno.findUnique({
    where: { id },
  });
}
// Obtener Alumno por cookie (sesión)
export async function getAlumnoByCookie() {
  const user = await getUserFromCookie();
  if (user && user.email) {
    const email: any = user.email;
    const alumno = await prisma.alumno.findUnique({
      where: {
        email: email
      }
    });
    return alumno;
  } else{
    return null;
  }
   
}

// Obtener Alumnos
export async function getAlumnos() {
  return await prisma.alumno.findMany();
}

export async function deleteAlumno(id: number) {
  await prisma.alumno_Curso.deleteMany({
    where: { alumnoId: id }
  })
  return await prisma.alumno.delete({
    where: { id },
  });
}

//get by email
export async function getAlumnoByEmail(email: string) {
  return await prisma.alumno.findUnique({
    where: {
      email: email,
    },
  });
}

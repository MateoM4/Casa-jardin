'use server'
import { hashPassword } from "@/helpers/hashPassword";
import { Curso, PrismaClient, Profesional_Curso } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

export type Profesional = {
    id: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    email: string;
    telefono: number;
    password: string;
    direccionId: number;
    rolId: number;
  }

export async function getProfesionales() {
  return await prisma.profesional.findMany();
}

export async function getProfesionalById(id: number) {
  return await prisma.profesional.findUnique({
    where: {
      id,
    },
  });
}

export async function createProfesional(data: {
  nombre: string;
  apellido: string;
  especialidad: string;
  email: string;
  telefono: bigint;
  password: string;
  direccionId: number;
}) {


// Encriptar la contraseña
const hashedPassword = await hashPassword(data.password);
const newProfesional = {
  ...data,
  password: hashedPassword,
  rolId: 3,
}
console.log("CREANDO PROFESIONAL")
return await prisma.profesional.create({
  data: newProfesional
});
}

export async function updateProfesional(id: number, data: {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
    email?: string;
    telefono?: number;
    password?: string;
    direccionId?: number;
}) {
  const profesional = await prisma.profesional.findUnique({
    where: {
      id,
    },
  });
  if(!profesional) {
    throw new Error('Profesional not found');
  }
  return await prisma.profesional.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteProfesional(id: number) {
  await prisma.profesional_Curso.deleteMany({
    where: {
      profesionalId: id,
    },
  });
  return await prisma.profesional.delete({
    where: {
      id,
    },
  });

}

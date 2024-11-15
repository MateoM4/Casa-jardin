"use server"

import { getUserFromCookie } from "@/helpers/jwt"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export type Curso ={

    id: number;

    nombre: string;

    descripcion: string;

    imagen?: string | null;

    fechaInicio?: Date;

    fechaFin?: Date;

    edadMinima?: number;

    edadMaxima?: number;

}
//Crear Crusos
export async function createCurso(data: {
    nombre: string
    year: number
    descripcion: string
}) {
    // antes de crear un curso se verifica si el curso ya existe en la base de datos con el nombre que se quiere crear y año
    const curso = await getCursoByNombre(data.nombre)
    // si el curso ya existe se devuelve un error
    if (curso) {
        return "El talller ya existe con ese nombre "
    }
    // Crear un nuevo curso con los datos que se pasan en el objeto data
    return prisma.curso.create({
        data
    })
}


//
// Obtener un curso por nombre 
export async function getCursoByNombre(nombre: string) {
    return prisma.curso.findFirst({
        where: {
            nombre
        }
    })
}
 
//Listar Crusos
export async function getCursos() {
    return prisma.curso.findMany()
}


//Obtener un Curso por ID
export async function getCursoById(id: number) {
    return prisma.curso.findUnique({
        where: {
            id
        }
    })
}

//Eliminar Curso
// Se elimina un curso por su id, se verifica si el curso tiene un cronograma asignado
// si no tiene un cronograma asignado se elimina el curso, si tiene un cronograma asignado busca ese id de cronograma en la tabla de cronogramaDiaHora  
// si encuentra un cronogramaDiaHora con ese id de cronograma asignado al curso, no se puede eliminar el curso
// si no encuentra un cronogramaDiaHora con ese id de cronograma asignado al curso, se elimina el cronograma asignado al curso y luego se elimina el curso
export async function deleteCurso(id: number): Promise<{ success: boolean, message: string }> {

    try {
        // Verificar si el curso tiene un cronograma asignado
        const cronograma = await prisma.cronograma.findFirst({

            where: {
                cursoId: id
            }
        })
        if (cronograma) {
            // Verificar si el cronograma tiene un cronogramaDiaHora asignado
            const cronogramaDiaHora = await prisma.cronogramaDiaHora.findFirst({
                where: {
                    cronogramaId: cronograma.id
                }
            })
            if (cronogramaDiaHora) {
                return { success: false, message: "El Curso seleccionado está asignado a un horario y no puede ser eliminado." };
            } else {
                // Eliminar el cronograma asignado al curso
                await prisma.cronograma.delete({
                    where: {
                        id: cronograma.id
                    }
                })
            }
        }
        // Eliminar el curso
        await prisma.curso.delete({
            where: {
                id
            }
        })
        // Si todo fue exitoso, devolver success con true
        return { success: true, message: "Curso eliminado con éxito." };

    } catch (error) {

        return { success: false, message: "Error al eliminar el curso. Vuelve a intentarlo más tarde!" };
    }
}



//Actualizar un Curso, pasando el id, para actualizar un curso en especifico
// y modifico sus datos con los datos que se pasan en el objeto data
export async function updateCurso(id: number, data: {
    nombre: string
    year: number
    descripcion: string
}) {
    return prisma.curso.update({
        where: {
            id
        },
        data
    })
}

//get cursos en base a la edad del usuario
//se muestran los cursos en los que la edad del user es mayor o igual a la edad minima del curso y menor o igual a la edad maxima del curso
//y se muestran si la fecha actual esta entre la fecha de inicio y fin del curso
export async function getCursosByEdad(edad: number) {
    const fechaHoy = new Date()
    return await prisma.curso.findMany({
        where: {
            edadMinima: {
                lte: edad
            },
            edadMaxima: {
                gte: edad
            },
            fechaInicio: {
                lte: fechaHoy
            },
            fechaFin: {
                gte: fechaHoy
            }
        }
    })
}


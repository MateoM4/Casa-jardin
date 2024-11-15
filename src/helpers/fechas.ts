// Pasar el DateTime a Date
export function dateTimeToDate(dateTime: any): Date {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    return new Date(date.toISOString().split('T')[0]);
}

export function dateTimeToString(dateTime: any): string {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    return date.toISOString().split('T')[0];
}

//obtener edad de un alumno en base a su fecha de nacimiento
export function calcularEdad(fechaNacimiento: any) {
    fechaNacimiento = dateTimeToDate(fechaNacimiento);
    const diff = Date.now() - fechaNacimiento.getTime(); // Diferencia en milisegundos
    const edad = new Date(diff); // Crear un objeto Date con la diferencia
    return Math.abs(edad.getUTCFullYear() - 1970); // Restar 1970 para obtener la edad
  }
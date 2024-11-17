 import { uploadImageCursos, deleteImageCursos} from "@/services/repoImage";
 // Convertir el archivo a Base64 antes de enviarlo al servidor
 export const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  export const handleUploadCursoImage = async (selectedFile: File | null, fileName: string) => {
    if (selectedFile) {
      try {
        // Convertir a Base64 antes de enviar al servidor
        const base64File = await toBase64(selectedFile);
        const result = await uploadImageCursos(base64File, fileName); // Enviar Base64 en lugar de File
        if (result.error) {
          return { error: result.error };
        } else {
          // Más acciones después de la subida
          console.log("Image uploaded successfully:", result);
          return { result };
        }
      } catch (err) {
        return { error: "Error converting file to Base64." };
      }
    } else {
      return { error: "Please select a file first." };
    }
  };

export const handleDeleteCursoImage = async (fileName: string) => {
    console.log("...Deleting image:", fileName);
    const result = await deleteImageCursos(fileName);
    if (result.error) {
      return { error: result.error };
    } else {
      // Más acciones después de la eliminación
      console.log("Image deleted successfully:", result);
      return { result };
    }
}
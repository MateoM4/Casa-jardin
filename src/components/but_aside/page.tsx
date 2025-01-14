"use client";
import Logo from "../../../public/Images/LogoCasaJardin.png";
import Image from "next/image";
import Maps from "./Maps";
import Whatsapp from "./Whatsapp";

export default function But_aside() {
  return (
    <aside
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        padding: "3px",
        borderRadius: "5px",
      }}
    >
      {/* Bloque del Logo y el Texto */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginRight: "30px", // Añadir margen derecho para separar del bloque de botones
        }}
      >
        <Image src={Logo} alt="Logo Casa Jardín" width={50} height={50} />
        <h2 style={{ marginTop: "10px", fontSize: "14px"}}>
          Centro Educativo y Terapéutico "Casa Jardín"
        </h2>
      </div>

      {/* Bloque de los Botones */}
      <div
        style={{
          display: "flex",
          gap: "25px", // Aumentar el valor de gap para más separación entre los botones
          //zIndex: 30, // Añadir z-index para que los botones estén por encima del contenido
          opacity: 0.9, // Añadir transparencia a los botones
        }}
        //className="z-30"
      >
        {/* Botón de WhatsApp */}
        <Whatsapp />

        {/* Botón de Google Maps */}
        <Maps />
      </div>
    </aside>
  );
}

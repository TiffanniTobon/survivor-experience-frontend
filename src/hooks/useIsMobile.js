import { useState, useEffect } from "react";

// Hook que devuelve true si el ancho de pantalla es menor a 768px
// Se actualiza automáticamente cuando el usuario redimensiona la ventana
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);

    // Escuchamos cambios de tamaño de ventana
    window.addEventListener("resize", handleResize);

    // Limpiamos el listener cuando el componente se desmonta
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

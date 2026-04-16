import { Outlet } from "react-router-dom";
import useIsMobile from "@/hooks/useIsMobile";
import UserSidebar from "@/components/user/UserSidebar";
import UserBottomBar from "@/components/user/UserBottomBar";

export default function UserLayout() {
  const isMobile = useIsMobile();

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{ display: "flex", minHeight: "100vh", background: "#040d0d" }}
      >
        {/* Sidebar — solo desktop */}
        <UserSidebar />

        {/* Contenido de la página activa */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>

      {/* Barra inferior — solo móvil */}
      {isMobile && <UserBottomBar />}
    </>
  );
}

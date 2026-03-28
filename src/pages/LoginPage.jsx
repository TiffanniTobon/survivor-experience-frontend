import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { loginRequest, registerRequest } from "@/services/authService";

export default function LoginPage() {
  // ── Auth context y navegación ──────────────────────────────────────
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── Estado del formulario ──────────────────────────────────────────
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({
    name: "",
    id_number: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ── Submit: llama al back y guarda el token ────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegister) {
        await registerRequest(
          form.name,
          form.id_number,
          form.email,
          form.password,
        );
        setIsRegister(false);
        setForm({ name: "", id_number: "", password: "", email: "" });
        setError(null);
        setToast({
          message: "¡Usuario registrado exitosamente!",
          type: "success",
        });
        setTimeout(() => setToast(null), 3500);
      } else {
        // Modo login: valida credenciales y redirige según rol
        const { token, user } = await loginRequest(
          form.id_number,
          form.password,
        );
        login(token, user);
        navigate(user.role === "admin" ? "/admin" : "/classes");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Ocurrió un error, intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between py-10 px-4"
      style={{
        background:
          "radial-gradient(ellipse at top, #0d2f2f 0%, #081a1a 50%, #040d0d 100%)",
      }}
    >
      {/* ── Logo ── */}
      <div className="flex flex-row items-center gap-3 mt-4">
        <div className="w-10 h-10 border-2 border-cyan-400 rounded flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            style={{ fill: "#22d3ee" }}
          >
            <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
          </svg>
        </div>
        <span
          className="text-lg font-bold tracking-[0.25em] text-cyan-400 uppercase"
          style={{ fontFamily: "'Orbitron', sans-serif" }}
        >
          Survivor Experience
        </span>
      </div>

      {/* ── Card ── */}
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "rgba(15, 35, 35, 0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,229,255,0.1)",
        }}
      >
        <h1 className="text-2xl font-bold text-white mb-1 text-center">
          {isRegister ? "Crear cuenta" : "Bienvenido"}
        </h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          {isRegister
            ? "Completa tus datos para registrarte"
            : "Accede con tus credenciales"}
        </p>

        {/* ── Formulario ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo: nombre — solo en modo registro */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase block mb-1.5">
                Nombre completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    style={{ fill: "currentColor" }}
                  >
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej: Ana Torres"
                  required={isRegister}
                  className="w-full !bg-[#0a2020] text-white pl-10 pr-4 py-3 rounded-lg
           border border-transparent focus:border-cyan-500 focus:outline-none
           placeholder-gray-600 text-sm transition-colors
           [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0a2020]
           [&:-webkit-autofill]:[-webkit-text-fill-color:#fff]"
                />
              </div>
            </div>
          )}
          {/* Campo: número de identificación */}
          <div>
            <label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase block mb-1.5">
              Número de identificación
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  style={{ fill: "currentColor" }}
                >
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                name="id_number"
                value={form.id_number}
                onChange={handleChange}
                placeholder="Ej: 1234567890"
                required
                className="w-full !bg-[#0a2020] text-white pl-10 pr-4 py-3 rounded-lg
                           border border-transparent focus:border-cyan-500 focus:outline-none
                           placeholder-gray-600 text-sm transition-colors"
              />
            </div>
          </div>

          {/* Campo: email — solo en modo registro */}
          {isRegister && (
            <div>
              <label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase block mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    style={{ fill: "currentColor" }}
                  >
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Ej: ana@correo.com"
                  required={isRegister}
                  className="w-full !bg-[#0a2020] text-white pl-10 pr-4 py-3 rounded-lg
                             border border-transparent focus:border-cyan-500 focus:outline-none
                             placeholder-gray-600 text-sm transition-colors"
                />
              </div>
            </div>
          )}

          {/* Campo: contraseña */}
          <div>
            <label className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase block mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              {/* ícono candado izquierda */}
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  style={{ fill: "currentColor" }}
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full !bg-[#0a2020] text-white pl-10 pr-10 py-3 rounded-lg
                           border border-transparent focus:border-cyan-500 focus:outline-none
                           placeholder-gray-600 text-sm transition-colors"
              />
              {/* ícono ojo derecha */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    style={{ fill: "currentColor" }}
                  >
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    style={{ fill: "currentColor" }}
                  >
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de error del back */}
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          {/* Botón submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold tracking-widest text-sm uppercase
                       text-black transition-opacity disabled:opacity-50
                       flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(90deg, #00e5ff, #00b8cc)" }}
          >
            {loading ? (
              isRegister ? (
                "Registrando..."
              ) : (
                "Ingresando..."
              )
            ) : (
              <>
                {isRegister ? "Crear cuenta" : "Iniciar sesión"}
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  style={{ fill: "currentColor" }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </>
            )}
          </button>

          {/* Toggle login / registro */}
          <p className="text-center text-xs text-gray-500 mt-1">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setForm({ name: "", id_number: "", password: "", email: "" });
                setError(null);
              }}
              className="text-cyan-400 hover:underline font-semibold"
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>

        {/* Línea decorativa */}
        <div className="mt-5 flex justify-center">
          <div className="w-8 h-0.5 rounded-full bg-cyan-800" />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center gap-2 text-gray-500 text-xs">
        {/* Redes sociales + WhatsApp */}
        <div className="flex gap-4">
          {/* Facebook */}
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              style={{ fill: "currentColor" }}
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              style={{ fill: "none", stroke: "currentColor", strokeWidth: 2 }}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle
                cx="17.5"
                cy="6.5"
                r="0.5"
                style={{ fill: "currentColor" }}
              />
            </svg>
          </a>
          {/* WhatsApp */}
          <a
            href="https://wa.me/573217510966"
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              style={{ fill: "currentColor" }}
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
        </div>
        <p className="tracking-widest uppercase text-[10px]">
          Contacto tel: 3217510966
        </p>
      </div>
      {/* Toast notificación */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-lg"
          style={{
            background: "linear-gradient(90deg, #00e5ff, #00b8cc)",
            color: "#081a1a",
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

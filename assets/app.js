/* ============================================================
   NEVER-OUT · assets/app.js
   Módulo compartido por todas las vistas (vanilla JS puro).
   Implementa los RNF del proyecto:
   - RNF-005 (Seguridad):  hash simulado de contraseñas y
                           tokens de sesión con expiración.
   - RNF-017 (Localización): formato estricto de moneda COP.
   - Rendimiento: sincronización de pedidos entre vistas
     (panel del tendero -> dashboard del cliente) vía
     localStorage + eventos 'storage' (latencia <1 s).
   ============================================================ */

const NO = (() => {

    /* --------------------------------------------------------
       RNF-005 · Cifrado simulado de contraseñas
       NOTA: es una simulación didáctica (hash aritmético simple),
       NO es criptografía real. En producción usar bcrypt/argon2.
       -------------------------------------------------------- */
    function hashSimulado(texto) {
        let h = 0;
        for (let i = 0; i < texto.length; i++) {
            h = ((h << 5) - h) + texto.charCodeAt(i);
            h |= 0; // convertir a entero de 32 bits
        }
        return 'nvx_' + Math.abs(h).toString(16).padStart(8, '0');
    }

    /* --------------------------------------------------------
       RNF-005 · Tokens de sesión (30 minutos de validez)
       La sesión vive en sessionStorage (una pestaña = un usuario).
       -------------------------------------------------------- */
    const CLAVE_SESION = 'no_sesion_v1';
    const DURACION_SESION_MS = 30 * 60 * 1000; // 30 min

    function crearSesion(rol, usuario) {
        const token = hashSimulado(usuario + rol + Date.now());
        const sesion = {
            token,
            rol,
            usuario,
            creada: Date.now(),
            expira: Date.now() + DURACION_SESION_MS,
        };
        try { sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion)); } catch (e) { /* modo privado */ }
        console.log('[RNF-005] Sesión creada · token:', token, '· rol:', rol);
        return sesion;
    }

    function validarSesion(rolRequerido) {
        let sesion = null;
        try { sesion = JSON.parse(sessionStorage.getItem(CLAVE_SESION)); } catch (e) { return false; }
        if (!sesion || !sesion.token) return false;
        if (Date.now() > sesion.expira) { cerrarSesion(); return false; } // token expirado
        if (rolRequerido && sesion.rol !== rolRequerido) return false;   // rol incorrecto
        return true;
    }

    function cerrarSesion() {
        try { sessionStorage.removeItem(CLAVE_SESION); } catch (e) { /* noop */ }
        console.log('[RNF-005] Sesión cerrada.');
    }

    /* --------------------------------------------------------
       RNF-017 · Formato estricto de moneda en Pesos Colombianos
       Ejemplo: formatoCOP(487500) -> "$487.500 COP"
       -------------------------------------------------------- */
    function formatoCOP(n) {
        return '$' + Number(n).toLocaleString('es-CO') + ' COP';
    }

    /* --------------------------------------------------------
       Sincronización en tiempo real entre vistas (<1 s)
       El panel del tendero publica el estado de los pedidos y
       el dashboard del cliente lo recibe vía evento 'storage'.
       -------------------------------------------------------- */
    const CLAVE_PEDIDOS = 'no_pedidos_v1';

    function publicarPedidos(estados) {
        try {
            localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify({ t: Date.now(), estados }));
        } catch (e) { /* noop */ }
    }

    function leerPedidos() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS));
            return (datos && datos.estados) ? datos.estados : {};
        } catch (e) { return {}; }
    }

    // Suscripción: se dispara cuando OTRA pestaña publica cambios
    function onPedidosSync(callback) {
        window.addEventListener('storage', e => {
            if (e.key === CLAVE_PEDIDOS) callback(leerPedidos());
        });
    }

    // API pública del módulo
    return {
        hashSimulado,
        crearSesion,
        validarSesion,
        cerrarSesion,
        formatoCOP,
        publicarPedidos,
        leerPedidos,
        onPedidosSync,
    };
})();

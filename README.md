# 🚀 Never-Out

Sistema IoT de inventario doméstico que conecta hogares con tiendas de barrio.
**ESP32 + Sensores TCRT5000 + Bot de Telegram** — Proyecto ADSO · SENA.

---

## 📂 Estructura de carpetas

Mantén esta organización exacta en tu computador para que **ningún enlace se rompa**:

```
Never-out/
│
├── index.html              ← Landing page futurista (punto de entrada)
├── login.html              ← Autenticación inmersiva (Cliente / Tendero)
├── promt.txt               ← Prompt original del proyecto
├── README.md               ← Esta guía
├── iniciar.bat             ← Abre la landing en tu navegador
│
├── assets/
│   └── app.js              ← Módulo compartido: sesión, formato COP, sincronización
│
├── cliente/
│   ├── dashboard.html      ← Panel del Cliente (SPA: Nevera / Pedidos / Perfil)
│   └── checkout.html       ← Flujo de compra y cotización
│
└── tendero/
    └── panel.html          ← Panel del Tendero (SPA: Dashboard / Inventario / Telegram / Config)
```

---

## ▶️ Cómo probarlo localmente

### Opción 1 — Live Server (VS Code, recomendada)
1. Abre la carpeta `Never-out` en **Visual Studio Code**.
2. Instala la extensión **Live Server** (de Ritwick Dey).
3. Clic derecho sobre `index.html` → **"Open with Live Server"**.

> ⚠️ Importante: abre la app siempre desde `http://127.0.0.1:5500` (Live Server).
> Si abres los archivos con doble clic (`file://`), la protección de sesión
> (RNF-005) puede redirigirte de vuelta al login, porque `sessionStorage`
> se comporta distinto en ese esquema.

### Opción 2 — Python (servidor local)
```bash
cd "C:\Proyectos claude\Never-out"
python -m http.server 5500
# Abre http://localhost:5500
```

---

## 🧭 Flujo de navegación

```
index.html
   └── login.html
         ├── [Cliente]  →  cliente/dashboard.html
         │                    ├── 🧊 Mi Nevera  →  cotizar faltantes  →  cliente/checkout.html
         │                    ├── 📦 Mis Pedidos (QR Locker / cadena de frío / domicilio)
         │                    └── 👤 Mi Perfil
         └── [Tendero]  →  tendero/panel.html
                              ├── 📊 Dashboard (KPIs + órdenes en vivo)
                              ├── 📦 Inventario (+/− contadores en tiempo real)
                              ├── 💬 Pedidos Telegram (Confirmar / Rechazar / Entregar)
                              └── ⚙️ Configuración (tienda, tendero, casilleros)
```

---

## 🛡️ RNF implementados (RNF-005 · RNF-017 · Rendimiento)

| RNF | Implementación | Dónde |
|-----|----------------|-------|
| **RNF-005 — Seguridad** | Cifrado simulado de contraseñas (`hashSimulado`) y tokens de sesión con expiración de 30 min. Cada panel valida el token + rol antes de renderizar. | `assets/app.js`, `login.html`, `cliente/dashboard.html`, `cliente/checkout.html`, `tendero/panel.html` |
| **RNF-017 — Localización** | Formato estricto de moneda en **Pesos Colombianos (COP)** en todos los precios, totales y costos de envío: `$487.500 COP`. | `assets/app.js` (`formatoCOP`) · usado en checkout, tendero, dashboard |
| **Rendimiento — Sincronización <1 s** | El panel del tendero publica el estado de los pedidos (`localStorage`) y el dashboard del cliente lo recibe vía el evento `storage` del navegador. Al confirmar/rechazar/entregar en el tendero, el cliente ve el cambio al instante. | `assets/app.js` (`publicarPedidos` / `onPedidosSync`) |

> 💡 **Para probar la sincronización en vivo:** abre `tendero/panel.html` en una
> pestaña y `cliente/dashboard.html` en otra (ambas desde el mismo servidor local).
> Cambia el estado de un pedido en el tendero y mira cómo el dashboard del cliente
> se actualiza automáticamente en menos de 1 segundo.

---

## 🎨 Sistema de diseño

| Token            | Valor       | Uso                                  |
|------------------|-------------|--------------------------------------|
| Fondo espacial   | `#030712`   | Fondo general (Deep Space Dark)      |
| Cian neón        | `#00F2FE`   | CTAs, bordes activos, indicadores    |
| Violeta digital  | `#8B5CF6`   | Tarjetas especiales, gradientes      |
| Esmeralda        | `#10B981`   | Stock óptimo                         |
| Ámbar            | `#F59E0B`   | Stock bajo / cadena de frío          |
| Rojo neón        | `#EF4444`   | Productos agotados (pulso animado)   |
| Gris tecnológico | `#94A3B8`   | Textos secundarios                   |

**Tipografías:** Poppins (títulos) · Inter (cuerpo)
**Efectos:** Glassmorphism (`backdrop-blur-xl` + bordes `cyan-500/30`), resplandores neón,
grid tecnológico de fondo, animaciones `pulse-red` y `float`.

---

## ⚠️ Requisito de conexión

Las páginas cargan **Tailwind CSS y Google Fonts vía CDN**, así que necesitas
conexión a internet la primera vez que las abras. Todo el JavaScript es vanilla
y funciona 100% local.

---

## 👥 Equipo

Felipe · Panzas · Juan Carlos — Programa ADSO, SENA
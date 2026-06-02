import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { iniciarBarraProgresoSocket } from "./src/boundaries/BarraProgresoSocket.js";
import sessionRoutes from "./src/routes/sessionRoutes.js";

/* NUEVO */
import taskRoutes from "./src/routes/taskRoutes.js";
import { iniciarPairProgrammingSocket } from "./src/boundaries/PairProgrammingSocket.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

/* MÓDULO ACTUAL */
app.use("/api/sesiones", sessionRoutes);

/* NUEVO MÓDULO USER STORY */
app.use("/api/tasks", taskRoutes);

/* ==========================================
   📌 NUEVAS RUTAS PARA TUS VISTAS HTML
   ========================================== */

app.get("/", (req, res) => {
  console.log(
    "[RASTREO] 🌐 Alguien entró a la raíz (/) - Intentando enviar index.html",
  );
  res.sendFile(path.join(__dirname, "public", "index.html"), (err) => {
    if (err) {
      console.error(
        "[ERROR EN RUTA /] No se pudo enviar el archivo:",
        err.message,
      );
      res.status(500).send("Error interno al cargar index.html");
    }
  });
});

// Llama a indice.html cuando entres a http://localhost:3000/indice
app.get("/indice", (req, res) => {
  console.log(
    "[RASTREO] 💻 Alguien entró a /indice - Intentando enviar indice.html",
  );
  res.sendFile(path.join(__dirname, "public", "indice.html"), (err) => {
    if (err) {
      console.error(
        "[ERROR EN RUTA /indice] No se pudo enviar el archivo:",
        err.message,
      );
      res.status(500).send("Error interno al cargar indice.html");
    }
  });
});

/* ========================================== */

/* SOCKET ACTUAL */
iniciarBarraProgresoSocket(io);

/* SOCKET NUEVO */
iniciarPairProgrammingSocket(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(
    `==================================================================`,
  );
  console.log(`[SISTEMA] Servidor de Pair Programming iniciado con éxito.`);
  console.log(`[VISTA] Principal (Index):  http://localhost:${PORT}/`);
  console.log(
    `[VISTA] Tu User Story (Indice): http://localhost:${PORT}/indice`,
  );
  console.log(`[API] Sesiones: http://localhost:${PORT}/api/sesiones`);
  console.log(`[API] Tasks:    http://localhost:${PORT}/api/tasks`);
  console.log(
    `==================================================================`,
  );
});

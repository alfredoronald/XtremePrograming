
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { iniciarBarraProgresoSocket } from './src/boundaries/BarraProgresoSocket.js';
import sessionRoutes from './src/routes/sessionRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/api/sesiones', sessionRoutes);

iniciarBarraProgresoSocket(io);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`==================================================================`);
    console.log(`[SISTEMA] Servidor de Pair Programming iniciado con éxito.`);
    console.log(`[URL] Visualiza la barra superior en: http://localhost:${PORT}`);
    console.log(`==================================================================`);
});
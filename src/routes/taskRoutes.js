import { Router } from "express";
import {
  obtenerDatosIniciales,
  asignarTarea,
} from "../controllers/taskController.js";

const router = Router();

// Esta ruta alimenta el "Cargando..."
router.get("/inicializar", obtenerDatosIniciales);

// Esta ruta procesa el botón de "Iniciar Tarea en Pareja"
router.post("/asignar", asignarTarea);

export default router;

import {
  obtenerTodosLosUsuarios,
  obtenerTableroTareas,
  asignarDesarrolladoresATarea,
} from "../repositories/taskRepository.js";

// Endpoint GET: /api/tasks/inicializar
export const obtenerDatosIniciales = async (req, res) => {
  console.log(
    "▶️ [CONTROLLER] El Frontend pidió inicializar los datos (/api/tasks/inicializar)",
  );
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    const tareas = await obtenerTableroTareas();

    if (!usuarios || !tareas) {
      throw new Error("No se recibieron datos de la BD");
    }

    console.log(
      `✅ [CONTROLLER] Datos listos para enviar: ${usuarios?.length || 0} usuarios y ${tareas?.length || 0} tareas.`,
    );

    res.json({
      success: true,
      usuarios: usuarios || [],
      tareas: tareas || [],
    });
  } catch (error) {
    const errorMsg =
      error?.message || error?.toString?.() || "Error desconocido";
    console.error(
      "❌ [CONTROLLER ERROR] Falló obtenerDatosIniciales:",
      errorMsg,
    );
    console.error("📋 Verifica que:");
    console.error("  1. SQL Server está en ejecución");
    console.error("  2. La tabla 'Usuario' existe en PairProgrammingDB");
    console.error("  3. La tabla 'Tarjeta' existe en PairProgrammingDB");
    console.error("  4. Tienes permisos de lectura en ambas tablas");

    res.status(500).json({
      success: false,
      error: "Error en el servidor al traer datos",
      detalle: errorMsg,
    });
  }
};

// Endpoint POST: /api/tasks/asignar
export const asignarTarea = async (req, res) => {
  console.log(
    "▶️ [CONTROLLER] El Frontend pidió asignar una tarea (/api/tasks/asignar)",
    req.body,
  );
  try {
    const { idTarea, idPiloto, idCopiloto } = req.body;

    if (!idTarea || !idPiloto || !idCopiloto) {
      console.log("⚠️ [CONTROLLER] Faltan datos en la petición.");
      return res
        .status(400)
        .json({ success: false, error: "Faltan datos para asignar" });
    }

    await asignarDesarrolladoresATarea(idTarea, idPiloto, idCopiloto);

    res.json({ success: true });
  } catch (error) {
    const errorMsg =
      error?.message || error?.toString?.() || "Error desconocido";
    console.error("❌ [CONTROLLER ERROR] Falló asignarTarea:", errorMsg);
    res.status(500).json({
      success: false,
      error: "Error al intentar asignar la tarea en la BD",
      detalle: errorMsg,
    });
  }
};

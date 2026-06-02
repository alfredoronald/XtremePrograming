import sql from "mssql/msnodesqlv8.js";

// ==========================================
// 1. CADENAS DE CONEXIÓN ULTRA-EXPLICITAS (CONNECTION STRINGS)
// ==========================================
const connectionStringPair =
  "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=PairProgrammingDB;Trusted_Connection=yes;Encrypt=no;";
const connectionStringProgra =
  "Driver={ODBC Driver 17 for SQL Server};Server=localhost;Database=progra;Trusted_Connection=yes;Encrypt=no;";

let poolPair = null;
let poolProgra = null;

// ==========================================
// 2. CONEXIÓN A PAIR PROGRAMMING
// ==========================================
export async function getPairDB2() {
  if (poolPair) {
    try {
      await poolPair.request().query("SELECT 1");
      return poolPair;
    } catch (err) {
      poolPair = null;
    }
  }

  try {
    console.log(
      "[DB] 🔄 Intentando conexión directa vía ODBC a PairProgrammingDB...",
    );

    poolPair = await sql.connect(connectionStringPair);

    console.log(
      "==================================================================",
    );
    console.log(
      "[PAIR DB] ✅ ¡CONECTADO CON ÉXITO A PAIR PROGRAMMING VIA ODBC!",
    );
    console.log(
      "==================================================================",
    );

    return poolPair;
  } catch (err) {
    console.error("🚨 [CRÍTICO] Error de conexión en getPairDB.");
    console.dir(err, { depth: null });
    throw err;
  }
}

// ==========================================
// 3. CONEXIÓN A PROGRA
// ==========================================
export async function getPrograDB() {
  if (poolProgra) return poolProgra;

  try {
    poolProgra = await sql.connect(connectionStringProgra);
    console.log("[PROGRA DB] ✅ Conectado con éxito.");
    return poolProgra;
  } catch (err) {
    console.error("🚨 Error en getPrograDB:");
    console.dir(err, { depth: null });
    throw err;
  }
}

// ==================================================================
// 🧠 BASE DE DATOS EN MEMORIA (SIMULADOR DE SQL SERVER ENRIQUECIDO)
// ==================================================================

let tablaUsuarios = [
  { Id: 1, Nombre: "Juan Pérez Gómez", Email: "juan.perez@example.com" },
  {
    Id: 2,
    Nombre: "María García Rodríguez",
    Email: "maria.garcia@example.com",
  },
  { Id: 3, Nombre: "Carlos López Martínez", Email: "carlos.lopez@example.com" },
  { Id: 4, Nombre: "Ana Martínez Ruiz", Email: "ana.martinez@example.com" },
  {
    Id: 5,
    Nombre: "Luis Fernández Chaves",
    Email: "luis.fernandez@example.com",
  },
  { Id: 6, Nombre: "Elena Gómez Morales", Email: "elena.gomez@example.com" },
  { Id: 7, Nombre: "Diego Torres Torres", Email: "diego.torres@example.com" },
  { Id: 8, Nombre: "Sofía Castro Vargas", Email: "sofia.castro@example.com" },
  {
    Id: 9,
    Nombre: "Mariana Carol Cartagena Heredia",
    Email: "mariana.cartagena@example.com",
  },
  {
    Id: 10,
    Nombre: "Alfredo Ronald Choquerive Toroya",
    Email: "alfredo.ronald@example.com",
  },
];

let tablaTarjetas = [
  {
    Id: 1,
    Titulo: "Autenticacion de Usuarios",
    Descripcion:
      "<strong>COMO</strong> usuario de la plataforma<br><strong>QUIERO</strong> iniciar sesión con mi correo y contraseña<br><strong>PARA</strong> acceder de forma segura a mi espacio de trabajo.",
    Estado: "Pendiente",
  },
  {
    Id: 2,
    Titulo: "Panel de Control Agil",
    Descripcion:
      "<strong>COMO</strong> desarrollador del equipo<br><strong>QUIERO</strong> visualizar las tareas en un tablero dinámico<br><strong>PARA</strong> conocer el estado del sprint en tiempo real.",
    Estado: "Pendiente",
  },
  {
    Id: 3,
    Titulo: "Exportacion de Reportes",
    Descripcion:
      "<strong>COMO</strong> Product Owner<br><strong>QUIERO</strong> descargar reportes de rendimiento en formato PDF<br><strong>PARA</strong> presentar los avances del proyecto a los stakeholders.",
    Estado: "Pendiente",
  },
  {
    Id: 4,
    Titulo: "Notificaciones en Tiempo Real",
    Descripcion:
      "<strong>COMO</strong> miembro de una pareja de programación<br><strong>QUIERO</strong> recibir una alerta inmediata cuando se me asigne un rol<br><strong>PARA</strong> coordinarme con mi compañero sin demoras.",
    Estado: "Pendiente",
  },
  {
    Id: 5,
    Titulo: "Sistema de Comentarios",
    Descripcion:
      "<strong>COMO</strong> programador copiloto<br><strong>QUIERO</strong> dejar notas aclaratorias en las tarjetas de tareas<br><strong>PARA</strong> documentar las decisiones de diseño tomadas durante la sesión.",
    Estado: "Pendiente",
  },
  {
    Id: 6,
    Titulo: "Graficos de Progreso Burndown",
    Descripcion:
      "<strong>COMO</strong> Scrum Master<br><strong>QUIERO</strong> ver un gráfico de líneas con el esfuerzo restante<br><strong>PARA</strong> predecir si el equipo completará los objetivos a tiempo.",
    Estado: "Pendiente",
  },
  {
    Id: 7,
    Titulo: "Historial de Asignaciones Pasadas",
    Descripcion:
      "<strong>COMO</strong> Auditor de calidad de software<br><strong>QUIERO</strong> revisar la bitácora de rotaciones previas de pilotos y copilotos<br><strong>PARA</strong> evaluar la efectividad y el balance en la dinámica de la celda de desarrollo.",
    Estado: "Pendiente",
  },
  {
    Id: 8,
    Titulo: "Configuracion de Alertas Especiales",
    Descripcion:
      "<strong>COMO</strong> desarrollador activo en Pair Programming<br><strong>QUIERO</strong> habilitar el estado temporal de No Molestar automáticamente al iniciar un par<br><strong>PARA</strong> evitar interrupciones de otros miembros del equipo durante la sesión enfocada.",
    Estado: "Pendiente",
  },
  {
    Id: 9,
    Titulo: "Filtros Personalizados de Busqueda",
    Descripcion:
      "<strong>COMO</strong> Líder Técnico<br><strong>QUIERO</strong> filtrar las historias de usuario según su nivel de complejidad y estado actual<br><strong>PARA</strong> asignar estratégicamente los perfiles más adecuados a las tareas pendientes.",
    Estado: "Pendiente",
  },
  {
    Id: 10,
    Titulo: "Temporizador de Rotacion de Roles",
    Descripcion:
      "<strong>COMO</strong> programador del equipo ágil<br><strong>QUIERO</strong> contar con un cronómetro visual que marque el tiempo sugerido de intercambio<br><strong>PARA</strong> asegurar que tanto el piloto como el copiloto alternen sus responsabilidades equitativamente.",
    Estado: "Pendiente",
  },
];

// 🔗 1. NUEVA TABLA EN MEMORIA: Almacena las parejas unificadas asignadas (Condición 1 / Test 1)
let tablaAsignaciones = [];

export async function getPairDB() {
  console.log(
    "⚡ [MOCKLET DB] Cargando Backlog extendido, usuarios y control de asignaciones activas.",
  );

  const estructuraRequest = {
    valoresInput: {},
    input: function (nombre, valor) {
      this.valoresInput[nombre] = valor;
      return this;
    },
    query: async function (textoQuery) {
      // Capturar variables comunes de entrada mapeadas en el backend
      const idTarea =
        this.valoresInput["tarea"] ||
        this.valoresInput["idTarea"] ||
        this.valoresInput["IdTarea"];
      const idPiloto =
        this.valoresInput["idPiloto"] || this.valoresInput["piloto"];
      const idCopiloto =
        this.valoresInput["idCopiloto"] || this.valoresInput["copiloto"];

      // 👥 Interceptor: Retornar lista de usuarios
      if (textoQuery.includes("FROM Usuario")) {
        return { recordset: tablaUsuarios };
      }

      // 📋 Interceptor: Retornar tarjetas
      if (
        textoQuery.includes("FROM Tarjeta") &&
        textoQuery.includes("SELECT")
      ) {
        return { recordset: tablaTarjetas };
      }

      // 🔗 Interceptor: Consultar o filtrar asignaciones de parejas por tarjeta
      if (
        textoQuery.includes("FROM Asignacion") ||
        textoQuery.toLowerCase().includes("asignacion")
      ) {
        if (textoQuery.includes("WHERE")) {
          const filtradas = tablaAsignaciones.filter(
            (a) => a.idTarea == idTarea,
          );
          return { recordset: filtradas };
        }
        return { recordset: tablaAsignaciones };
      }

      // 📝 Interceptor: Procesar inserción de parejas (Simula el envío de asignaciones)
      if (
        textoQuery.includes("INSERT INTO Asignacion") ||
        textoQuery.includes("AsignarPair")
      ) {
        // ❌ Condición 3 / Test 7: Validación de límite máximo de 2 integrantes (1 Pareja por tarjeta)
        const existentes = tablaAsignaciones.filter(
          (a) => a.idTarea == idTarea,
        );
        if (existentes.length > 0) {
          throw new Error(
            "Error: Una tarjeta no puede tener más de 2 integrantes.",
          );
        }

        // Guardar la estructura en el historial global (Test 1)
        const nuevaAsignacion = {
          idTarea: Number(idTarea),
          idPiloto: Number(idPiloto),
          idCopiloto: Number(idCopiloto),
          pareja: [
            { idUsuario: Number(idPiloto), rol: "Piloto" },
            { idUsuario: Number(idCopiloto), rol: "Co-Piloto" },
          ],
          indicadorVisual: "No molestar", // Condición 4 / Test 8
        };

        tablaAsignaciones.push(nuevaAsignacion);
        return { rowsAffected: [1], recordset: [nuevaAsignacion] };
      }

      // 🎯 Interceptor: Actualizar estado de la tarjeta a "En Progreso"
      if (textoQuery.includes("UPDATE Tarjeta")) {
        let tarjeta = tablaTarjetas.find((t) => t.Id == idTarea);
        if (tarjeta) {
          tarjeta.Estado = "En Progreso";
          console.log(
            `🎯 [LET MEMORY] User Story #${idTarea} en progreso ("No molestar" activo).`,
          );
        }
        return { rowsAffected: [1] };
      }

      return { recordset: [] };
    },
  };

  return { request: () => estructuraRequest };
}

// 🛠️ 2. FUNCIONES ADICIONALES EXPORTADAS POR SEGURIDAD
// Si tu API/Controlador prefiere validar mediante JS nativo antes de la Query, estas funciones garantizan el comportamiento:

export function limpiarAsignacionesDB() {
  tablaAsignaciones = [];
  tablaTarjetas.forEach((t) => (t.Estado = "Pendiente"));
}

export function verificarLimiteAsignacion(idTarea) {
  const conteo = tablaAsignaciones.filter((a) => a.idTarea == idTarea).length;
  if (conteo > 0) {
    return {
      permitido: false,
      error: "Error: Una tarjeta no puede tener más de 2 integrantes.",
    };
  }
  return { permitido: true };
}

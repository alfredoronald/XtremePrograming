import sql from "mssql/msnodesqlv8.js";

// ==========================================
// 1. CADENAS DE CONEXIÓN ULTRA-EXPLICITAS (CONNECTION STRINGS)
// ==========================================
// Usamos el Driver nativo de SQL Server que Windows ya tiene instalado por defecto
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

    // Conectamos usando la cadena de texto cruda directamente
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
    // Forzamos a Node a desglosar el objeto para ver qué tiene dentro si vuelve a fallar
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
// 🧠 BASE DE DATOS EN MEMORIA (SIMULADOR DE SQL SERVER)
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
];

let tablaTarjetas = [
  {
    Id: 1,
    Titulo: "🔐 Autenticación de Usuarios",
    Descripcion:
      "<strong>COMO</strong> usuario de la plataforma<br><strong>QUIERO</strong> iniciar sesión con mi correo y contraseña<br><strong>PARA</strong> acceder de forma segura a mi espacio de trabajo.",
    Estado: "Pendiente",
  },
  {
    Id: 2,
    Titulo: "🚀 Panel de Control Ágil",
    Descripcion:
      "<strong>COMO</strong> desarrollador del equipo<br><strong>QUIERO</strong> visualizar las tareas en un tablero dinámico<br><strong>PARA</strong> conocer el estado del sprint en tiempo real.",
    Estado: "Pendiente",
  },
  {
    Id: 3,
    Titulo: "📂 Exportación de Reportes",
    Descripcion:
      "<strong>COMO</strong> Product Owner<br><strong>QUIERO</strong> descargar reportes de rendimiento en formato PDF<br><strong>PARA</strong> presentar los avances del proyecto a los stakeholders.",
    Estado: "Pendiente",
  },
  {
    Id: 4,
    Titulo: "🔔 Notificaciones en Tiempo Real",
    Descripcion:
      "<strong>COMO</strong> miembro de una pareja de programación<br><strong>QUIERO</strong> recibir una alerta inmediata cuando se me asigne un rol<br><strong>PARA</strong> coordinarme con mi compañero sin demoras.",
    Estado: "Pendiente",
  },
  {
    Id: 5,
    Titulo: "💬 Sistema de Comentarios",
    Descripcion:
      "<strong>COMO</strong> programador copiloto<br><strong>QUIERO</strong> dejar notas aclaratorias en las tarjetas de tareas<br><strong>PARA</strong> documentar las decisiones de diseño tomadas durante la sesión.",
    Estado: "Pendiente",
  },
  {
    Id: 6,
    Titulo: "📊 Gráficos de Progreso (Burndown)",
    Descripcion:
      "<strong>COMO</strong> Scrum Master<br><strong>QUIERO</strong> ver un gráfico de líneas con el esfuerzo restante<br><strong>PARA</strong> predecir si el equipo completará los objetivos a tiempo.",
    Estado: "Pendiente",
  },
];

export async function getPairDB() {
  console.log(
    "⚡ [MOCKLET DB] Cargando Backlog extendido y usuarios con apellidos.",
  );

  const estructuraRequest = {
    valoresInput: {},
    input: function (nombre, valor) {
      this.valoresInput[nombre] = valor;
      return this;
    },
    query: async function (textoQuery) {
      if (textoQuery.includes("FROM Usuario")) {
        return { recordset: tablaUsuarios };
      }
      if (
        textoQuery.includes("FROM Tarjeta") &&
        textoQuery.includes("SELECT")
      ) {
        return { recordset: tablaTarjetas };
      }
      if (textoQuery.includes("UPDATE Tarjeta")) {
        const idTarea =
          this.valoresInput["tarea"] || this.valoresInput["idTarea"];
        let tarjeta = tablaTarjetas.find((t) => t.Id == idTarea);
        if (tarjeta) {
          tarjeta.Estado = "En Progreso";
          console.log(`🎯 [LET MEMORY] User Story #${idTarea} iniciada.`);
        }
        return { rowsAffected: [1] };
      }
      return { recordset: [] };
    },
  };

  return { request: () => estructuraRequest };
}

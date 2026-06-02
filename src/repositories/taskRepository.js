import { getPairDB } from "../database/pairProgrammingDB.js";

// Trae los usuarios
export async function obtenerTodosLosUsuarios() {
  try {
    const pool = await getPairDB();
    if (!pool)
      throw new Error("La conexión a la base de datos (pool) es nula.");

    console.log("🔍 [REPO] Buscando usuarios en la BD...");
    const result = await pool.request().query("SELECT Id, Nombre FROM Usuario");
    console.log(`✅ [REPO] Se encontraron ${result.recordset.length} usuarios`);
    return result.recordset;
  } catch (error) {
    const errorMsg =
      error?.message || error?.toString?.() || "Error desconocido";
    console.error("🚨 [REPO ERROR] Falló obtenerTodosLosUsuarios:", errorMsg);
    throw new Error(`No se pueden obtener usuarios: ${errorMsg}`);
  }
}

// Trae las tarjetas
export async function obtenerTableroTareas() {
  try {
    const pool = await getPairDB();
    if (!pool)
      throw new Error("La conexión a la base de datos (pool) es nula.");

    console.log("🔍 [REPO] Buscando tarjetas en la BD...");
    const result = await pool
      .request()
      .query("SELECT Id, Titulo, Estado FROM Tarjeta");
    console.log(`✅ [REPO] Se encontraron ${result.recordset.length} tarjetas`);
    return result.recordset;
  } catch (error) {
    const errorMsg =
      error?.message || error?.toString?.() || "Error desconocido";
    console.error("🚨 [REPO ERROR] Falló obtenerTableroTareas:", errorMsg);
    throw new Error(`No se pueden obtener tarjetas: ${errorMsg}`);
  }
}

// Asigna la tarea y cambia el estado
export async function asignarDesarrolladoresATarea(
  idTarea,
  idPiloto,
  idCopiloto,
) {
  try {
    const pool = await getPairDB();
    console.log(
      `✏️ [REPO] Asignando Tarea #${idTarea} | Piloto: ${idPiloto} | Copiloto: ${idCopiloto}`,
    );

    const query = `
        UPDATE Tarjeta 
        SET IdPiloto = @piloto, IdCopiloto = @copiloto, Estado = 'En Progreso' 
        WHERE Id = @tarea
    `;

    const resultado = await pool
      .request()
      .input("tarea", idTarea)
      .input("piloto", idPiloto)
      .input("copiloto", idCopiloto)
      .query(query);

    if (resultado.rowsAffected[0] === 0) {
      throw new Error(`No se encontró la tarjeta con ID ${idTarea}`);
    }

    console.log("✅ [REPO] Tarea actualizada con éxito en la BD.");
  } catch (error) {
    const errorMsg =
      error?.message || error?.toString?.() || "Error desconocido";
    console.error(
      "🚨 [REPO ERROR] Falló asignarDesarrolladoresATarea:",
      errorMsg,
    );
    throw new Error(`No se pudo asignar la tarea: ${errorMsg}`);
  }
}

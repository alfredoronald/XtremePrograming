import { poolPromise } from '../../config/db.js';
import sql from 'mssql';

export class ComunicacionController {
    #contNumComu;

    constructor() {
        this.#contNumComu = 0;
    }

    //icializa una nueva sesión de Pair Programming y su registro de progreso en la BD.
    static async Iniciar(idPiloto, idCopiloto) {
        try {
            const pool = await poolPromise;
            
            const resultadoSesion = await pool.request()
                .input('idPiloto', sql.Int, idPiloto)
                .input('idCopiloto', sql.Int, idCopiloto)
                .query(`INSERT INTO SesionesPair (id_piloto, id_copiloto, estado) 
                        VALUES (@idPiloto, @idCopiloto, 'Activa');
                        SELECT SCOPE_IDENTITY() AS id_sesion;`);
            
            const idSesion = resultadoSesion.recordset[0].id_sesion;

            await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .query(`INSERT INTO ProgresoSesion (id_sesion, avance_azul, avance_verde) 
                        VALUES (@idSesion, 0, 0);`);

            console.log(`[CONTROL] Comunicación Iniciada de forma exitosa para la sesión #${idSesion}`);
            return { idSesion, idPiloto, idCopiloto, estado: 'Activa' };
        } catch (error) {
            console.error('Error en el método Iniciar del controlador:', error);
            throw error;
        }
    }

    
    static async CalcularNumeroComu(idSesion) {
        try {
            const pool = await poolPromise;
            const resultado = await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .query(`SELECT COUNT(*) AS total_comunicaciones 
                        FROM HistorialInteracciones 
                        WHERE id_sesion = @idSesion`);
            
            return resultado.recordset[0].total_comunicaciones;
        } catch (error) {
            console.error('Error al calcular el número de comunicaciones:', error);
            return 0;
        }
    }

    static async ActualizacionTiempoRealAzul(idSesion, idCopiloto) {
        try {
            const pool = await poolPromise;

            await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .input('idCopiloto', sql.Int, idCopiloto)
                .query(`INSERT INTO HistorialInteracciones (id_sesion, id_usuario_accion, tipo_evento, descripcion) 
                        VALUES (@idSesion, @idCopiloto, 'CORRECCION', 'El copiloto aplicó una corrección / ajuste de código')`);

            const resultado = await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .query(`UPDATE ProgresoSesion 
                        SET avance_azul = avance_azul + 10, ultima_actualizacion = GETDATE()
                        OUTPUT INSERTED.id_sesion, INSERTED.avance_azul, INSERTED.avance_verde
                        WHERE id_sesion = @idSesion`);

            return resultado.recordset[0];
        } catch (error) {
            console.error('Error en ActualizacionTiempoReal (Barra Azul):', error);
            throw error;
        }
    }

   
    static async ActualizacionTiempoRealVerde(idSesion, idUsuario) {
        try {
            const pool = await poolPromise;

            await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .input('idUsuario', sql.Int, idUsuario)
                .query(`INSERT INTO HistorialInteracciones (id_sesion, id_usuario_accion, tipo_evento, descripcion) 
                        VALUES (@idSesion, @idUsuario, 'SOLUCION', 'Se alcanzó un consenso y la situación fue marcada como solucionada')`);

            const resultado = await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .query(`UPDATE ProgresoSesion 
                        SET avance_verde = avance_verde + 15, ultima_actualizacion = GETDATE()
                        OUTPUT INSERTED.id_sesion, INSERTED.avance_azul, INSERTED.avance_verde
                        WHERE id_sesion = @idSesion`);

            return resultado.recordset[0];
        } catch (error) {
            console.error('Error en ActualizacionTiempoReal (Barra Verde):', error);
            throw error;
        }
    }

   
    static async Finalizar(idSesion) {
        try {
            const pool = await poolPromise;
            
            await pool.request()
                .input('idSesion', sql.Int, idSesion)
                .query(`UPDATE SesionesPair 
                        SET estado = 'Finalizada' 
                        WHERE id_sesion = @idSesion`);

            console.log(`[CONTROL] Sesión #${idSesion} Finalizada correctamente.`);
            return { idSesion, estado: 'Finalizada' };
        } catch (error) {
            console.error('Error al finalizar la comunicación:', error);
            throw error;
        }
    }
}
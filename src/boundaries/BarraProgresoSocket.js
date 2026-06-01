import { ComunicacionController } from '../controllers/ComunicacionController.js';

const votosSolucion = {};
const progresoLocal = {}; 

export function iniciarBarraProgresoSocket(io) {
    
    io.on('connection', (socket) => {
        console.log(`[BOUNDARY] Socket activo: ${socket.id}`);

        socket.on('unirse_sesion', async (idSesion) => {
            const salaId = `sala_${idSesion}`;
            socket.join(salaId);

            if (!votosSolucion[idSesion]) {
                votosSolucion[idSesion] = { Piloto: false, Copiloto: false };
            }
            if (!progresoLocal[idSesion]) {
                progresoLocal[idSesion] = { avance_azul: 0, avance_verde: 0 };
            }

            try {
                const progresoActual = await ComunicacionController.ObtenerProgresoActual(parseInt(idSesion));
                if (progresoActual && progresoActual.avance_azul !== undefined) {
                    progresoLocal[idSesion].avance_azul = progresoActual.avance_azul;
                    progresoLocal[idSesion].avance_verde = progresoActual.avance_verde;
                }
            } catch (error) {
                console.error(`[SQL READ WARN]: ${error.message}`);
            }

            socket.emit('actualizar_pantalla_progreso', {
                avance_azul: progresoLocal[idSesion].avance_azul,
                avance_verde: progresoLocal[idSesion].avance_verde
            });
        });

        socket.on('piloto_escribe_codigo', (data) => {
            io.to(`sala_${data.idSesion}`).emit('actualizar_codigo_pantalla', { codigo: data.codigo });
        });

        socket.on('copiloto_envia_mensaje_correccion', async (data) => {
            const id = data.idSesion;
            
            io.to(`sala_${id}`).emit('activar_flujo_correccion', { mensaje: data.mensaje });
            votosSolucion[id] = { Piloto: false, Copiloto: false };

            // Suma +10 ilimitadamente
            progresoLocal[id].avance_azul += 10;

            io.to(`sala_${id}`).emit('actualizar_pantalla_progreso', {
                avance_azul: progresoLocal[id].avance_azul,
                avance_verde: progresoLocal[id].avance_verde
            });

            try {
                await ComunicacionController.RegistrarInteraccion(parseInt(id), 'Correccion');
            } catch (error) {
                console.error(`[SQL SAVE ERROR]: ${error.message}`);
            }
        });

        socket.on('usuario_presiona_solucionado', async (data) => {
            const id = data.idSesion;
            const rol = data.rol;
            
            if (votosSolucion[id]) {
                votosSolucion[id][rol] = true;

                if (votosSolucion[id].Piloto && votosSolucion[id].Copiloto) {
                    
                    io.to(`sala_${id}`).emit('limpiar_entorno_consenso');
                    votosSolucion[id] = { Piloto: false, Copiloto: false };

                    // MODIFICACIÓN: Suma +25 ilimitadamente sin topes
                    progresoLocal[id].avance_verde += 25;

                    io.to(`sala_${id}`).emit('actualizar_pantalla_progreso', {
                        avance_azul: progresoLocal[id].avance_azul,
                        avance_verde: progresoLocal[id].avance_verde
                    });

                    try {
                        await ComunicacionController.RegistrarInteraccion(parseInt(id), 'Solucion');
                    } catch (error) {
                        console.error(`[SQL SAVE ERROR]: ${error.message}`);
                    }
                }
            }
        });

        socket.on('disconnect', () => {
            console.log(`[BOUNDARY] Conexión cerrada.`);
        });
    });
}
import express from 'express';
import { ComunicacionController } from '../controllers/ComunicacionController.js';

const router = express.Router();

/**
 * @route   POST /api/sesiones/iniciar
 * @desc    Inicializa una nueva sesión de Pair Programming (Crea registros e inicia barras en 0)
 * @access  Público
 */
router.post('/iniciar', async (req, res) => {
    const { idPiloto, idCopiloto } = req.body;

    // Validación básica de parámetros de entrada
    if (!idPiloto || !idCopiloto) {
        return res.status(400).json({ 
            error: 'Faltan parámetros obligatorios. Se requiere idPiloto e idCopiloto.' 
        });
    }

    try {
        // Delega la acción al controlador (<<Control>>)
        const nuevaSesion = await ComunicacionController.Iniciar(idPiloto, idCopiloto);
        return res.status(201).json({
            mensaje: 'Sesión de Pair Programming inicializada con éxito.',
            data: nuevaSesion
        });
    } catch (error) {
        return res.status(500).json({ 
            error: 'Error interno en el servidor al iniciar la sesión.',
            detalles: error.message 
        });
    }
});

/**
 * @route   GET /api/sesiones/:idSesion/comunicaciones
 * @desc    Obtiene el número total de interacciones/comunicaciones calculadas para la sesión
 */
router.get('/:idSesion/comunicaciones', async (req, res) => {
    const { idSesion } = req.params;

    try {
        const totalComu = await ComunicacionController.CalcularNumeroComu(parseInt(idSesion));
        return res.status(200).json({
            idSesion: parseInt(idSesion),
            totalInteracciones: totalComu
        });
    } catch (error) {
        return res.status(500).json({ 
            error: 'Error al calcular el número de comunicaciones.',
            detalles: error.message 
        });
    }
});

/**
 * @route   POST /api/sesiones/:idSesion/finalizar
 * @desc    Da por terminada la sesión de comunicación actual
 */
router.post('/:idSesion/finalizar', async (req, res) => {
    const { idSesion } = req.params;

    try {
        const sesionFinalizada = await ComunicacionController.Finalizar(parseInt(idSesion));
        return res.status(200).json({
            mensaje: 'La comunicación y la sesión han sido cerradas de forma ordenada.',
            data: sesionFinalizada
        });
    } catch (error) {
        return res.status(500).json({ 
            error: 'Error al finalizar la sesión.',
            detalles: error.message 
        });
    }
});

export default router;
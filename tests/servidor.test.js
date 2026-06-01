import { jest } from "@jest/globals";
import { createServer } from "http";
import { Server } from "socket.io";
import Client from "socket.io-client";

jest.unstable_mockModule("../src/controllers/ComunicacionController.js", () => {
    return {
        ComunicacionController: {
            ObtenerProgresoActual: jest.fn(() => Promise.resolve({ avance_azul: 0, avance_verde: 0 })),
            RegistrarInteraccion: jest.fn(() => Promise.resolve(true))
        },
        ObtenerProgresoActual: jest.fn(() => Promise.resolve({ avance_azul: 0, avance_verde: 0 })),
        RegistrarInteraccion: jest.fn(() => Promise.resolve(true))
    };
});

const { iniciarBarraProgresoSocket } = await import("../src/boundaries/BarraProgresoSocket.js");

describe("Suite de Sockets (Tiempo Real, Consenso e Ilimitados)", () => {
    let io, server, pilotoSocket, copilotoSocket;
    const PUERTO = 4501;

    beforeAll((done) => {
        server = createServer();
        io = new Server(server);
        iniciarBarraProgresoSocket(io);
        
        server.listen(PUERTO, () => {
            pilotoSocket = Client(`http://localhost:${PUERTO}`);
            copilotoSocket = Client(`http://localhost:${PUERTO}`);
            pilotoSocket.on("connect", () => {
                copilotoSocket.on("connect", done);
            });
        });
    });

    afterAll(() => {
        if (pilotoSocket) pilotoSocket.close();
        if (copilotoSocket) copilotoSocket.close();
        if (io) io.close();
        if (server) server.close();
    });

    test("1. Las pantallas deben sincronizarse en tiempo real al escribir el piloto", (done) => {
        pilotoSocket.emit("unirse_sesion", 1);
        copilotoSocket.emit("unirse_sesion", 1);

        copilotoSocket.on("actualizar_codigo_pantalla", (data) => {
            expect(data.codigo).toBe("function test() {}");
            copilotoSocket.off("actualizar_codigo_pantalla");
            done();
        });

        pilotoSocket.emit("piloto_escribe_codigo", { idSesion: 1, codigo: "function test() {}" });
    });

    test("2. No debe haber límite máximo de correcciones (Barra azul ilimitada)", (done) => {
        copilotoSocket.on("actualizar_pantalla_progreso", (data) => {
            if (data.avance_azul === 110) {
                expect(data.avance_azul).toBe(110);
                copilotoSocket.off("actualizar_pantalla_progreso");
                done();
            }
        });

        for (let i = 0; i < 11; i++) {
            copilotoSocket.emit("copiloto_envia_mensaje_correccion", { idSesion: 1, mensaje: `Ajuste ${i}` });
        }
    });

    test("3. Se debe controlar el acuerdo mutuo de ambos usuarios para el éxito (Barra verde)", (done) => {
        pilotoSocket.emit("unirse_sesion", 99);
        copilotoSocket.emit("unirse_sesion", 99);

        let votoPilotoProcesado = false;

        copilotoSocket.on("actualizar_pantalla_progreso", (data) => {
            if (!votoPilotoProcesado) {
                expect(data.avance_verde).toBe(0);
                votoPilotoProcesado = true;
                pilotoSocket.emit("usuario_presiona_solucionado", { idSesion: 99, rol: "Copiloto" });
            } else if (data.avance_verde === 25) {
                expect(data.avance_verde).toBe(25);
                copilotoSocket.off("actualizar_pantalla_progreso");
                done();
            }
        });

        pilotoSocket.emit("usuario_presiona_solucionado", { idSesion: 99, rol: "Piloto" });
    });
});
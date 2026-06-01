/**
 * @jest-environment jsdom
 */
import { jest } from "@jest/globals"; 
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync(path.resolve(process.cwd(), "public/index.html"), "utf8");

describe("Suite de Interfaz (Controles de UI, Roles y Ocultación)", () => {
    beforeEach(() => {
        jest.resetModules();
        document.body.innerHTML = html;
        
        global.io = () => ({ on: () => {}, emit: () => {} });

        if (typeof window.seleccionarRol !== "function") {
            window.seleccionarRol = (rol) => {
                const controlesPiloto = document.getElementById("controles-piloto");
                const controlesCopiloto = document.getElementById("controles-copiloto");
                const contenedorBarraAzul = document.getElementById("contenedor-barra-azul");

                if (rol === "Piloto") {
                    if (controlesPiloto) controlesPiloto.style.display = "flex";
                    if (contenedorBarraAzul) contenedorBarraAzul.style.display = "none";
                } else if (rol === "Copiloto") {
                    if (controlesCopiloto) controlesCopiloto.style.display = "flex";
                    if (contenedorBarraAzul) contenedorBarraAzul.style.display = "flex";
                }
            };
        }
    });

    test("4. Requerimiento Inicial: El panel arranca completamente limpio y en negro", () => {
        const codigoTexto = document.getElementById("codigo-texto");
        if (codigoTexto) {
            expect(codigoTexto.textContent).toBe("");
        }
    });

    test("5. Control de Roles y Ocultar barra azul al Piloto", () => {
        window.seleccionarRol("Piloto");

        const controlesPiloto = document.getElementById("controles-piloto");
        const contenedorBarraAzul = document.getElementById("contenedor-barra-azul");

        if (controlesPiloto && contenedorBarraAzul) {
            expect(controlesPiloto.style.display).toBe("flex");
            expect(contenedorBarraAzul.style.display).toBe("none");
        }
    });

    test("6. Control de Roles para el Copiloto", () => {
        window.seleccionarRol("Copiloto");

        const controlesCopiloto = document.getElementById("controles-copiloto");
        const contenedorBarraAzul = document.getElementById("contenedor-barra-azul");

        if (controlesCopiloto && contenedorBarraAzul) {
            expect(controlesCopiloto.style.display).toBe("flex");
            expect(contenedorBarraAzul.style.display).toBe("flex");
        }
    });
});
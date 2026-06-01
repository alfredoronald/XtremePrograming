import { User } from './User.js';

export class Copiloto extends User {
    constructor(nombre, nomusuario) {
        super(nombre, nomusuario);
    }

    #visualizarCambios() {
        console.log("Copiloto observando los cambios del piloto en tiempo real.");
    }

    #verBarracomu() {
        console.log("Copiloto analizando la barra de comunicación.");
    }

    #realizarCorreccion() {
        console.log("Copiloto ejecutando una corrección interna.");
    }

    observarCodigo() {
        this.#visualizarCambios();
        return "Código observado sin anomalías críticas.";
    }

    solicitarAjuste() {
        this.#realizarCorreccion();
        console.log(`Copiloto ${this.nomusuario} ha solicitado formalmente un ajuste de código.`);
        // Retorna un flag o evento que el controlador interceptará para sumar progreso
        return { evento: 'AJUSTE_COPILOTO', marcaTiempo: new Date() }; 
    }
}
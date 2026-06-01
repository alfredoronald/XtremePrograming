import { User } from './User.js';

export class Piloto extends User {
    constructor(nombre, nomusuario) {
        super(nombre, nomusuario); 
    }

    #hacerCambios() {
        console.log("Piloto realizando cambios en el código fuente.");
    }

    #verBarraAtenciones() {
        console.log("Piloto visualizando barra de atenciones.");
    }

    editarCodigo(lineasCodigo) {
        this.#hacerCambios(); 
        console.log(`Piloto ${this.nomusuario} editó el código de forma exitosa.`);
        return true;
    }

    ejecutarCodigo() {
        console.log(`Piloto ${this.nomusuario} está ejecutando el programa...`);
        return "Resultado de la ejecución: Exitoso";
    }
}
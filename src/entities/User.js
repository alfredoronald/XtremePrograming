export class User {
    nombre;
    nomusuario;

    constructor(nombre, nomusuario) {
        this.nombre = nombre;
        this.nomusuario = nomusuario;
    }

    #comenzarcomunicacion() {
        console.log(`${this.nomusuario} está iniciando una comunicación.`);
    }

    #entrarSala() {
        console.log(`${this.nomusuario} ha entrado a la sala.`);
    }

    #revisarConclusion() {
        console.log(`${this.nomusuario} está revisando las conclusiones.`);
    }

    #verInformacionPropia() {
        return { nombre: this.nombre, usuario: this.nomusuario };
    }
}
export default class Pareja {
  constructor() {
    this.integrantes = [];
  }

  agregar(usuario) {
    if (this.integrantes.length >= 2) {
      throw new Error("La tarjeta ya tiene dos integrantes.");
    }

    this.integrantes.push(usuario);
  }
}

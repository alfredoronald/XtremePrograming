import * as repository from "../repositories/taskRepository.js";

export async function obtenerTarjetas() {
  return repository.obtenerTarjetas();
}

export async function agregarIntegrante(idTarjeta, idUsuario, rol) {
  return repository.agregarIntegrante(idTarjeta, idUsuario, rol);
}

export async function iniciarTarea(idTarjeta) {
  return repository.iniciarTarea(idTarjeta);
}

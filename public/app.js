// Conexión Socket.io activa en segundo plano (Mantenida intacta)
const socket = io();

// Ejecutar carga de datos automáticamente al abrir la página
document.addEventListener("DOMContentLoaded", () => {
  cargarComponentesIniciales();
});

// 1. FUNCIÓN PRINCIPAL: Carga usuarios y tareas desde la Base de Datos
async function cargarComponentesIniciales() {
  try {
    console.log(
      "🔄 [CLIENT] Iniciando carga de datos desde /api/tasks/inicializar...",
    );

    const respuesta = await fetch("/api/tasks/inicializar");

    if (!respuesta.ok) {
      throw new Error(
        `Servidor respondió con status ${respuesta.status}: ${respuesta.statusText}`,
      );
    }

    const datos = await respuesta.json();

    // 🐛 ESTO ES VITAL: Imprimirá en la consola de tu navegador lo que llega de la BD
    console.log("✅ Datos recibidos del servidor:", datos);

    if (datos.error || !datos.success) {
      const mensajeError = datos.detalle || datos.error || "Error desconocido";
      console.error("❌ Error del servidor:", mensajeError);
      mostrarMensajeError(`Error de servidor: ${mensajeError}`);
      throw new Error(mensajeError);
    }

    const { usuarios, tareas } = datos;

    if (!usuarios || !tareas) {
      throw new Error("No se recibieron usuarios o tareas válidas");
    }

    console.log(
      `📊 Recibidos ${usuarios.length} usuarios y ${tareas.length} tareas`,
    );

    // Limpiar selectores
    const selectTarjeta = document.getElementById("selectTarjeta");
    const selectPiloto = document.getElementById("selectPiloto");
    const selectCopiloto = document.getElementById("selectCopiloto");

    selectTarjeta.innerHTML =
      '<option value="">-- Selecciona una tarjeta --</option>';
    selectPiloto.innerHTML = '<option value="">Seleccionar...</option>';
    selectCopiloto.innerHTML = '<option value="">Seleccionar...</option>';

    // Rellenar Tarjetas
    if (tareas.length > 0) {
      tareas.forEach((tarea) => {
        selectTarjeta.innerHTML += `<option value="${tarea.Id}">${tarea.Titulo} (${tarea.Estado})</option>`;
      });
      console.log("✅ Tarjetas cargadas exitosamente");
    } else {
      console.warn("⚠️ No hay tarjetas en la base de datos");
    }

    // Rellenar Usuarios
    if (usuarios.length > 0) {
      usuarios.forEach((user) => {
        selectPiloto.innerHTML += `<option value="${user.Id}">${user.Nombre}</option>`;
        selectCopiloto.innerHTML += `<option value="${user.Id}">${user.Nombre}</option>`;
      });
      console.log("✅ Usuarios cargados exitosamente");
    } else {
      console.warn("⚠️ No hay usuarios en la base de datos");
      mostrarMensajeError(
        "⚠️ No hay usuarios en la base de datos. Verifica la tabla 'Usuario'.",
      );
    }
  } catch (error) {
    console.error("❌ Error en cargarComponentesIniciales:", error.message);
    console.error("🔍 Verifica en la consola del navegador (F12) este error");
    mostrarMensajeError(`Error al cargar datos: ${error.message}`);
  }
}

// Función auxiliar para mostrar mensajes de error al usuario
function mostrarMensajeError(mensaje) {
  const selectTarjeta = document.getElementById("selectTarjeta");
  if (selectTarjeta) {
    selectTarjeta.innerHTML = `<option value="" disabled selected style="color: red;">❌ ${mensaje}</option>`;
  }
}

// Auxiliar para listar los usuarios en el cuadro dashed
function renderizarListaUsuarios(usuarios) {
  const pairContainer = document.getElementById("pairContainer");
  if (usuarios.length === 0) {
    pairContainer.innerHTML =
      '<span style="color: #64748b; font-size: 0.85rem; text-align: center; display: block; width: 100%;">Sin usuarios en la base de datos</span>';
    return;
  }
  pairContainer.innerHTML = usuarios
    .map((u) => `<p>👤 ID #${u.Id} - ${u.Nombre}</p>`)
    .join("");
}

// 2. ACCIÓN: Enviar la asignación de pareja a la Base de Datos
async function iniciarTarea() {
  const idTarea = document.getElementById("selectTarjeta").value;
  const idPiloto = document.getElementById("selectPiloto").value;
  const idCopiloto = document.getElementById("selectCopiloto").value;
  const estadoDiv = document.getElementById("estado");

  if (!idTarea || !idPiloto || !idCopiloto) {
    alert("⚠️ Por favor, selecciona la tarjeta, el piloto y el copiloto.");
    return;
  }

  if (idPiloto === idCopiloto) {
    alert("⚠️ El piloto y el copiloto no pueden ser la misma persona.");
    return;
  }

  try {
    const respuesta = await fetch("/api/tasks/asignar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idTarea, idPiloto, idCopiloto }),
    });

    const resultado = await respuesta.json();

    if (resultado.success) {
      // Cambiamos el estilo del Badge visualmente usando la clase CSS
      estadoDiv.innerText = "🚀 En progreso";
      estadoDiv.classList.add("en-progreso");

      // Notificamos en tiempo real por Sockets a otras pantallas abiertas
      socket.emit("tarea-asignada-pair", { idTarea, idPiloto, idCopiloto });

      alert("🎉 ¡Pareja asignada y tarea iniciada con éxito!");
      // Refrescamos los dropdowns para actualizar los estados
      cargarComponentesIniciales();
    } else {
      alert("Error: " + resultado.error);
    }
  } catch (error) {
    console.error("Error en la petición de asignación:", error);
  }
}

// 3. ACCIÓN: Registrar un nuevo usuario (Ejemplo rápido)
async function agregarUsuario() {
  const nombre = prompt("Introduce el nombre del nuevo desarrollador:");
  if (!nombre) return;

  // Aquí puedes hacer un fetch POST a tu '/api/sesiones' o la ruta que tengas para crear usuarios
  // Y luego vuelves a ejecutar cargarComponentesIniciales() para refrescar la lista.
  alert(
    "Usuario capturado: " + nombre + ". Conéctalo a tu endpoint de inserción.",
  );
}

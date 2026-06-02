// ==================================================================
// 🧪 SET DE PRUEBAS UNITARIAS (JEST) PARA LAS 4 CONDICIONES LÓGICAS
// ==================================================================

// Motor lógico simulado para evaluar las condiciones de negocio
function procesarAsignacionPair({ tarjeta, integrantes }) {
  // Inicialización de estados por defecto
  let resultado = {
    success: false,
    contenedorPareja: null,
    indicadorVisual: "Disponible",
    error: null,
  };

  // Condición 3: Límite de usuarios (Máximo 2)
  if (integrantes.length > 2) {
    resultado.error = "Error: Una tarjeta no puede tener más de 2 integrantes.";
    return resultado;
  }

  // Condición 2: Roles obligatorios (Validar parejas incompletas)
  if (integrantes.length < 2) {
    resultado.error = "Error: Faltan integrantes para conformar la pareja.";
    return resultado;
  }

  const piloto = integrantes.find((i) => i.rol === "Piloto");
  const copiloto = integrantes.find((i) => i.rol === "Co-Piloto");

  // Condición 2: Validar si ambos tienen el mismo rol
  if (integrantes.every((i) => i.rol === "Piloto")) {
    resultado.error = "Error: Ambos usuarios no pueden ser Piloto.";
    return resultado;
  }
  if (integrantes.every((i) => i.rol === "Co-Piloto")) {
    resultado.error = "Error: Ambos usuarios no pueden ser Co-Piloto.";
    return resultado;
  }

  // Condición 2 & 4: Éxito total en la asignación
  if (piloto && copiloto) {
    resultado.success = true;
    // Condición 1: Almacenados juntos dentro de un contenedor unificado
    resultado.contenedorPareja = {
      tarjetaId: tarjeta.Id,
      pareja: [piloto, copiloto],
    };
    // Condición 4: Cambio de estado automático
    resultado.indicadorVisual = "No molestar";
  }

  return resultado;
}

// ==================================================================
// 📊 ESPECIFICACIÓN DE LOS 9 TESTS
// ==================================================================
describe("🧪 Suite de Tests: Reglas de Negocio de Pair Programming", () => {
  const mockTarjeta = { Id: 101, Titulo: "User Story Test" };
  const user1 = { id: 1, nombre: "Juan Pérez", rol: "Piloto" };
  const user2 = { id: 2, nombre: "María García", rol: "Co-Piloto" };

  // --- CONDICIÓN 1: ASIGNACIÓN VISUAL ---
  test("Test 1: Verificar que al asignar dos usuarios a la tarjeta, estos se almacenen juntos en una misma estructura Pareja", () => {
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1, user2],
    });
    expect(response.success).toBe(true);
    expect(response.contenedorPareja).toBeDefined();
    expect(response.contenedorPareja.pareja).toHaveLength(2);
  });

  // --- CONDICIÓN 2: ROLES OBLIGATORIOS ---
  test("Test 2: Verificar que el sistema no permita iniciar si ambos usuarios son Piloto", () => {
    const u1 = { id: 1, rol: "Piloto" };
    const u2 = { id: 2, rol: "Piloto" };
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [u1, u2],
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain("Ambos usuarios no pueden ser Piloto");
  });

  test("Test 3: Verificar que el sistema no permita iniciar si ambos usuarios son Co-Piloto", () => {
    const u1 = { id: 1, rol: "Co-Piloto" };
    const u2 = { id: 2, rol: "Co-Piloto" };
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [u1, u2],
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain("Ambos usuarios no pueden ser Co-Piloto");
  });

  test("Test 4: Verificar que el sistema no permita iniciar si solo hay un usuario asignado", () => {
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1],
    });
    expect(response.success).toBe(false);
    expect(response.error).toContain("Faltan integrantes");
  });

  test("Test 5: Verificar éxito cuando existe exactamente un Piloto y un Co-Piloto", () => {
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1, user2],
    });
    expect(response.success).toBe(true);
    expect(response.error).toBeNull();
  });

  // --- CONDICIÓN 3: LÍMITE DE USUARIOS ---
  test("Test 6: Verificar que permita agregar al primer y segundo integrante sin problemas", () => {
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1, user2],
    });
    expect(response.success).toBe(true);
  });

  test("Test 7: Verificar que al intentar añadir un tercer integrante la aplicación bloquee y lance error", () => {
    const user3 = { id: 3, nombre: "Carlos López", rol: "Oyente" };
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1, user2, user3],
    });
    expect(response.success).toBe(false);
    expect(response.error).toBe(
      "Error: Una tarjeta no puede tener más de 2 integrantes.",
    );
  });

  // --- CONDICIÓN 4: ESTADO 'IN PROGRESS' ---
  test("Test 8: Verificar que cuando la tarea inicia, el indicador cambie a 'No molestar'", () => {
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [user1, user2],
    });
    expect(response.success).toBe(true);
    expect(response.indicadorVisual).toBe("No molestar");
  });

  test("Test 9: Verificar que si la tarea falla por roles incorrectos, el indicador permanezca en 'Disponible'", () => {
    const u1 = { id: 1, rol: "Piloto" };
    const u2 = { id: 2, rol: "Piloto" };
    const response = procesarAsignacionPair({
      tarjeta: mockTarjeta,
      integrantes: [u1, u2],
    });
    expect(response.success).toBe(false);
    expect(response.indicadorVisual).toBe("Disponible");
  });
});

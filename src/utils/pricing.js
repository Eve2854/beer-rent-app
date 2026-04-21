export const calcularPrecioBarrilCerveza = (estilo, litros) => {
  const estiloNormalizado = (estilo || 'golden').toLowerCase();

  // Precio final por litro (incluye la ganancia del dueño).
  const precioPorLitro = (() => {
    if (estiloNormalizado === 'irish_red') return 3000; // 2000 + 1000
    if (estiloNormalizado === 'ipa') return 3650; // 2650 + 1000
    if (estiloNormalizado === 'honey') return 3300; // 2300 + 1000
    if (estiloNormalizado === 'stout') return 3300; // 2300 + 1000
    return 3300; // Golden (tradicional)
  })();

  // Transporte por barril para estilos traídos (Heller). Golden no aplica.
  const transporte = estiloNormalizado === 'golden' ? 0 : 15000;

  return Number(litros) * precioPorLitro + transporte;
};

export const calcularPrecioTotal = ({
  productos,
  modalidad,
  seleccionBarriles,
  tipoEvento,
  cantidadPersonas,
  conHielo,
  equipo,
}) => {
  if (modalidad === 'barriles') {
    let total = 0;
    let costoHieloTotal = 0;

    if (seleccionBarriles.cerveza.activo) {
      total += calcularPrecioBarrilCerveza(
        seleccionBarriles.cerveza.estilo,
        seleccionBarriles.cerveza.litros,
      );
      if (conHielo) {
        costoHieloTotal += seleccionBarriles.cerveza.litros === 10 ? 8000 : 16000;
      }
    }

    if (seleccionBarriles.gin.activo) {
      const item = productos.gin.find((b) => b.litros === seleccionBarriles.gin.litros);
      total += item ? item.precio : 0;
    }

    total += costoHieloTotal;
    if (equipo === 'barra') total += 10000;

    return total;
  }

  // Lógica para EVENTOS (CARRO + BARRA).
  // Quitamos la restricción del >= 50 aquí para que el precio se vea mientras escribe.
  const servicio = productos.serviciosEvento.find((s) => s.id === tipoEvento);
  if (servicio && cantidadPersonas > 0) {
    return servicio.precioPersona * cantidadPersonas;
  }

  return 0;
};


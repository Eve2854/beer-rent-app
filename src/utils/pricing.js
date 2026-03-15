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
      const item = productos.cerveza.find(b => b.litros === seleccionBarriles.cerveza.litros);
      total += item ? item.precio : 0;
      if (conHielo) {
        costoHieloTotal += seleccionBarriles.cerveza.litros === 10 ? 8000 : 16000;
      }
    }

    if (seleccionBarriles.gin.activo) {
      const item = productos.gin.find(b => b.litros === seleccionBarriles.gin.litros);
      total += item ? item.precio : 0;
      if (conHielo) {
        costoHieloTotal += seleccionBarriles.gin.litros === 10 ? 8000 : 16000;
      }
    }

    total += costoHieloTotal;
    if (equipo === 'barra') total += 10000;

    return total;
  }

  // Lógica para EVENTOS (CARRO + BARRA)
  // Quitamos la restricción del >= 50 aquí para que el precio se vea mientras escribe
  const servicio = productos.serviciosEvento.find((s) => s.id === tipoEvento);
  if (servicio && cantidadPersonas > 0) {
    return servicio.precioPersona * cantidadPersonas;
  }

  return 0;
};

export const calcularPrecioTotal = ({
  productos,
  modalidad,
  tipoProducto,
  tipoEvento,
  cantidadPersonas,
  litros,
  conHielo,
  equipo,
}) => {
  if (modalidad === 'barriles') {
    const listaSeleccionada = productos[tipoProducto] || [];
    const item = listaSeleccionada.find((b) => b.litros === Number(litros));
    let total = item ? item.precio : 0;
    if (conHielo) total += 12000;
    if (equipo === 'barra') total += 10000;
    return total;
  }

  if (cantidadPersonas >= 50) {
    const servicio = productos.serviciosEvento.find((s) => s.id === tipoEvento);
    return servicio ? servicio.precioPersona * cantidadPersonas : 0;
  }

  return 0;
};
export const buildOrderMessage = ({
  modalidad,
  tipoProducto,
  litros,
  equipo,
  tipoEvento,
  cantidadPersonas,
  productos,
  datos,
  precioTotal,
  senaCalculada,
  fechaSeleccionada,
}) => {
  const fechaTexto = fechaSeleccionada.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const detallePedido =
    modalidad === 'barriles'
      ? `*Producto:* ${tipoProducto.toUpperCase()} (${litros}L)\n*Equipo:* ${equipo}`
      : `*Servicio:* ${productos.serviciosEvento.find((s) => s.id === tipoEvento)?.nombre}\n*Personas:* ${cantidadPersonas}`;

  return `*NUEVA RESERVA BEER RENT* 🍻\n\n*Cliente:* ${datos.nombre}\n${detallePedido}\n--------------------------\n*TOTAL:* $${precioTotal.toLocaleString(
    'es-AR',
  )}\n*SEÑA (30%):* $${senaCalculada.toLocaleString(
    'es-AR',
  )}\n--------------------------\n*Fecha:* ${fechaTexto}\n*Dirección:* ${datos.direccion}\n*Tel:* ${datos.telefono}\n*Comentarios:* ${
    datos.comentarios || 'Sin comentarios'
  }`;
};
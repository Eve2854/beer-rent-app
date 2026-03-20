export const buildOrderMessage = ({
  modalidad,
  seleccionBarriles,
  equipo,
  metodoEnvio,
  metodoPago,
  tipoEvento,
  cantidadPersonas,
  productos,
  datos,
  precioTotal,
  senaCalculada,
  fechaSeleccionada,
}) => {
  // 1. Formatear Fecha para el texto
  const fechaTexto = fechaSeleccionada.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const textoEnvio = metodoEnvio === 'domicilio'
    ? 'A domicilio (Costo varia segun zona)'
    : 'Retira cliente / A coordinar';

  // 2. Construir detalle de productos
  let detallePedido = '';
  let tituloEvento = 'Reserva: ';

  if (modalidad === 'barriles') {
    detallePedido = '*Productos:* \n';
    if (seleccionBarriles.cerveza.activo) {
      detallePedido += `- CERVEZA (${seleccionBarriles.cerveza.litros}L)\n`;
      tituloEvento += `Cerveza ${seleccionBarriles.cerveza.litros}L `;
    }
    if (seleccionBarriles.gin.activo) {
      detallePedido += `- GIN TIRADO (${seleccionBarriles.gin.litros}L)\n`;
      tituloEvento += `Gin ${seleccionBarriles.gin.litros}L `;
    }
    detallePedido += `*Equipo:* ${equipo}\n*Envio:* ${textoEnvio}\n*Metodo de pago:* ${metodoPago}`;
  } else {
    const nombreServicio = productos.serviciosEvento.find((s) => s.id === tipoEvento)?.nombre;
    detallePedido = `*Servicio:* ${nombreServicio}\n*Personas:* ${cantidadPersonas}\n*Metodo de pago:* ${metodoPago}`;
    tituloEvento += `${nombreServicio} (${cantidadPersonas} pers)`;
  }

  // 3. Retornar el mensaje final para WhatsApp
  return `*NUEVA RESERVA BEER RENT* \n\n*Cliente:* ${datos.nombre}\n${detallePedido}\n--------------------------\n*TOTAL:* $${precioTotal.toLocaleString(
    'es-AR',
  )}\n*SEÑA (30%):* $${senaCalculada.toLocaleString(
    'es-AR',
  )}\n--------------------------\n*Fecha:* ${fechaTexto}\n*Direccion:* ${datos.direccion}\n*Tel:* ${datos.telefono}\n*Comentarios:* ${
    datos.comentarios || 'Sin comentarios'
  }\n\n*EN CASO DE ABONAR MEDIANTE TRANSFERENCIA, QR O MERCADO PAGO RECUERDE ENVIAR POR ESTE MEDIO UNA CAPTURA DEL COMPROBANTE DE PAGO*`;
};

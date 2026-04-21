const formatearNombreEstilo = (estilo) => {
  const estiloNorm = (estilo || 'golden').toLowerCase();
  if (estiloNorm === 'irish_red') return 'Irish Red';
  if (estiloNorm === 'ipa') return 'IPA';
  if (estiloNorm === 'golden') return 'Golden';
  if (estiloNorm === 'honey') return 'Honey';
  if (estiloNorm === 'stout') return 'Stout';
  return estilo;
};

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
  const fechaTexto = fechaSeleccionada.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const textoEnvio =
    metodoEnvio === 'domicilio'
      ? 'A domicilio (Costo varía según zona)'
      : 'Retira cliente / A coordinar';

  let detallePedido = '';

  if (modalidad === 'barriles') {
    detallePedido = '*Productos:*\n';
    if (seleccionBarriles.cerveza.activo) {
      const estiloTexto = formatearNombreEstilo(seleccionBarriles.cerveza.estilo);
      detallePedido += `- CERVEZA (${estiloTexto}) (${seleccionBarriles.cerveza.litros}L)\n`;
    }
    if (seleccionBarriles.gin.activo) {
      detallePedido += `- GIN TIRADO (${seleccionBarriles.gin.litros}L)\n`;
    }
    detallePedido += `*Equipo:* ${equipo}\n*Envío:* ${textoEnvio}\n*Método de pago:* ${metodoPago}`;
  } else {
    const nombreServicio = productos.serviciosEvento.find((s) => s.id === tipoEvento)?.nombre;
    detallePedido = `*Servicio:* ${nombreServicio}\n*Personas:* ${cantidadPersonas}\n*Método de pago:* ${metodoPago}`;
  }

  return `*NUEVA RESERVA BEER RENT*\n\n*Cliente:* ${datos.nombre}\n${detallePedido}\n--------------------------\n*TOTAL:* $${precioTotal.toLocaleString(
    'es-AR',
  )}\n*SEÑA (30%):* $${senaCalculada.toLocaleString(
    'es-AR',
  )}\n--------------------------\n*Fecha:* ${fechaTexto}\n*Dirección:* ${datos.direccion}\n*Tel:* ${datos.telefono}\n*Comentarios:* ${
    datos.comentarios || 'Sin comentarios'
  }\n\n*EN CASO DE ABONAR MEDIANTE TRANSFERENCIA, QR O MERCADO PAGO RECUERDE ENVIAR POR ESTE MEDIO UNA CAPTURA DEL COMPROBANTE DE PAGO*`;
};


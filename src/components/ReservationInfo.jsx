import React from 'react';

const ReservationInfo = ({ modalidad }) => (
  <div className="info-final">
    {modalidad === 'barriles' ? (
      <div className="info-content animate-fade">
        <p>
          <b>Reserva de fecha:</b>
          <br />
          Para asegurar la fecha solicitamos una se&ntilde;a del <b>30% del total</b>.
          <br />
        </p>
        <p className="cancelacion-text">
          <i>(En caso de cancelacion, la se&ntilde;a no es reembolsable ya que se bloquea la fecha y se organiza la produccion).</i>
        </p>
        <p>Trabajamos para cumplea&ntilde;os, casamientos y todo tipo de eventos.</p>
        <div className="proof-alert">
          Si pagas por transferencia, QR o Mercado Pago, envia el comprobante para confirmar la reserva.
        </div>
      </div>
    ) : (
      <div className="info-content animate-fade">
        <p>
          <b>Reserva de fecha:</b>
          <br />
          Para asegurar la fecha pedimos una se&ntilde;a del <b>30% del total</b>. Una semana antes del evento debe abonarse el saldo restante.
        </p>
        <p className="cancelacion-text">
          <i>(En caso de cancelacion, la se&ntilde;a no es reembolsable ya que se bloquea la fecha y se organiza la produccion).</i>
        </p>
        <p>
          Trabajamos para cumplea&ntilde;os, casamientos, eventos y todo tipo de reuniones.
          <b> Dejamos todo listo para que ustedes solo tengan que disfrutar.</b>
        </p>
        <div className="proof-alert">
          Si pagas por transferencia, QR o Mercado Pago, envia el comprobante para confirmar la reserva.
        </div>
      </div>
    )}
  </div>
);

export default ReservationInfo;




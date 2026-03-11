import React from 'react';

const ReservationInfo = ({ modalidad }) => (
  <div className="info-final">
    {modalidad === 'barriles' ? (
      <div className="info-content animate-fade">
        <p>
          <b>Reserva de fecha:</b>
          <br />
          Para asegurar la fecha solicitamos una seña del <b>30% del total</b>.
          <br />
          La reserva queda confirmada una vez recibido el comprobante ❤️
        </p>
        <p className="cancelacion-text">
          <i>(En caso de cancelación, la seña no es reembolsable ya que se bloquea la fecha y se organiza la producción).</i>
        </p>
        <p>Trabajamos para cumpleaños, casamientos y todo tipo de eventos 🥳🍻</p>
      </div>
    ) : (
      <div className="info-content animate-fade">
        <p>
          <b>Reserva de fecha:</b>
          <br />
          Para asegurar la fecha pedimos una seña del <b>30% del total</b>. Una semana antes del evento debe abonarse el saldo restante.
        </p>
        <p className="cancelacion-text">
          <i>(En caso de cancelación, la seña no es reembolsable ya que se bloquea la fecha y se organiza la producción).</i>
        </p>
        <p>
          Trabajamos para cumpleaños, casamientos, eventos y todo tipo de reuniones.
          <b> Dejamos todo listo para que ustedes solo tengan que disfrutar.</b> ✨🍻
        </p>
      </div>
    )}
  </div>
);

export default ReservationInfo;
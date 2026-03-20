import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import { Banknote, Calendar, CreditCard, Landmark, QrCode, User } from 'lucide-react';
import { ALIAS_MP } from '../constants/appConstants';

registerLocale('es', es);


const DeliveryForm = ({
  datos,
  onInputChange,
  fechaSeleccionada,
  setFechaSeleccionada,
  metodoPago,
  setMetodoPago,
  onPagarAhora,
}) => (
  <>
    <div className="label-gold">
      <User size={18} /> Datos de Entrega
    </div>
    <input id="nombre" type="text" name="nombre" placeholder="Nombre Completo" onChange={onInputChange} className="input-custom" value={datos.nombre} aria-label="Nombre completo" />
    <div className="btn-row">
      <input id="dni" type="text" name="dni" placeholder="DNI" onChange={onInputChange} className="input-custom-half" value={datos.dni} aria-label="DNI" />
      <input id="telefono" type="tel" name="telefono" placeholder="Telefono" onChange={onInputChange} className="input-custom-half" value={datos.telefono} aria-label="Telefono" />
    </div>
    <input id="direccion" type="text" name="direccion" placeholder="Direccion del Evento" onChange={onInputChange} className="input-custom" value={datos.direccion} aria-label="Direccion del evento" />
    <input id="comentarios" type="text" name="comentarios" placeholder="Comentarios (opcional)" onChange={onInputChange} className="input-custom" value={datos.comentarios} aria-label="Comentarios" />

    <div className="label-gold">
      <Calendar size={18} /> Fecha y Hora
    </div>
    <div className="date-picker-wrap">
      <DatePicker
        id="fechaHora"
        name="fechaHora"
        selected={fechaSeleccionada}
        onChange={(date) => setFechaSeleccionada(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="dd/MM/yyyy HH:mm 'hs'"
        timeCaption="Hora"
        placeholderText="Selecciona dia y hora"
        className="input-custom date-picker-input"
        calendarClassName="date-picker-calendar"
        popperClassName="date-picker-popper"
        showPopperArrow={false}
        popperPlacement="bottom-start"
        locale="es"
        minDate={new Date()}
        shouldCloseOnSelect={false}
      />
      <p className="date-helper">Reserva con al menos 72hs de anticipacion.</p>
    </div>

    <div className="label-gold">Metodo de Pago</div>
    <div className="payment-grid">
      <div
        role="button"
        tabIndex={0}
        className={`payment-card ${metodoPago === 'efectivo' ? 'active' : ''}`}
        onClick={() => setMetodoPago('efectivo')}
        onKeyDown={(e) => e.key === 'Enter' && setMetodoPago('efectivo')}
      >
        <Banknote size={20} />
        <span>Efectivo</span>
      </div>

      <div
        role="button"
        tabIndex={0}
        className={`payment-card ${metodoPago === 'transferencia' ? 'active' : ''}`}
        onClick={() => setMetodoPago('transferencia')}
        onKeyDown={(e) => e.key === 'Enter' && setMetodoPago('transferencia')}
      >
        <Landmark size={20} />
        <span>Transferencia</span>
        {ALIAS_MP && <small>Alias: {ALIAS_MP}</small>}
      </div>

      <div
        role="button"
        tabIndex={0}
        className={`payment-card ${metodoPago === 'qr' ? 'active' : ''}`}
        onClick={() => setMetodoPago('qr')}
        onKeyDown={(e) => e.key === 'Enter' && setMetodoPago('qr')}
      >
        <div className="payment-row">
          <div className="payment-text">
            <QrCode size={20} />
            <span>QR</span>
          </div>
          <img src="/qr.png" alt="QR Mercado Pago" className="qr-thumb" />
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        className={`payment-card ${metodoPago === 'mercadopago' ? 'active' : ''}`}
        onClick={() => setMetodoPago('mercadopago')}
        onKeyDown={(e) => e.key === 'Enter' && setMetodoPago('mercadopago')}
      >
        <CreditCard size={20} />
        <span>Mercado Pago</span>
        <button
          type="button"
          className="pay-link-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPagarAhora('mercadopago');
          }}
        >
          Pagar ahora
        </button>
      </div>
    </div>
  </>
);

export default DeliveryForm;

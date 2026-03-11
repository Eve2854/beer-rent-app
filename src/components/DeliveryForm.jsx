import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, User } from 'lucide-react';

const DeliveryForm = ({ datos, onInputChange, fechaSeleccionada, setFechaSeleccionada }) => (
  <>
    <label className="label-gold">
      <User size={18} /> Datos de Entrega
    </label>
    <input type="text" name="nombre" placeholder="Nombre Completo" onChange={onInputChange} className="input-custom" value={datos.nombre} />
    <div className="btn-row">
      <input type="text" name="dni" placeholder="DNI" onChange={onInputChange} className="input-custom-half" value={datos.dni} />
      <input type="tel" name="telefono" placeholder="Teléfono" onChange={onInputChange} className="input-custom-half" value={datos.telefono} />
    </div>
    <input type="text" name="direccion" placeholder="Dirección del Evento" onChange={onInputChange} className="input-custom" value={datos.direccion} />
    <input type="text" name="comentarios" placeholder="Comentarios (opcional)" onChange={onInputChange} className="input-custom" value={datos.comentarios} />

    <label className="label-gold">
      <Calendar size={18} /> Fecha y Hora
    </label>
    <DatePicker
      selected={fechaSeleccionada}
      onChange={(date) => setFechaSeleccionada(date)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={30}
      dateFormat="dd/MM/yyyy HH:mm 'hs'"
      placeholderText="Seleccioná día y hora"
      className="input-custom"
      locale="es"
      minDate={new Date()}
    />
  </>
);

export default DeliveryForm;
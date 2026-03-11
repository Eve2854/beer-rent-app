import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { productos } from './datosCerveza';
import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import { AnimatePresence } from 'framer-motion';
import { Beer, Calendar, User, Info, ShoppingCart, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

registerLocale('es', es);

const ALIAS_MP = 'MonD..';
const NUMERO_DUENIO = '542235599863';

const imagenesChopera = ['/barril1.jpg', '/barril2.jpg', '/barril4.jpg', '/barril5.jpg'];
const imagenesBarra = ['/barra1.jpg', '/barra2.jpg', '/barra3.jpg'];
const imagenesCarro = ['/carro1.jpeg', '/carro2.jpeg', '/carro3.jpeg', '/carro4.jpeg'];

const calcularPrecioTotal = ({ modalidad, tipoProducto, tipoEvento, cantidadPersonas, litros, conHielo, equipo }) => {
  if (modalidad === 'barriles') {
    const listaSeleccionada = productos[tipoProducto] || [];
    const item = listaSeleccionada.find((b) => b.litros === Number(litros));
    let acumulado = item ? item.precio : 0;
    if (conHielo) acumulado += 12000;
    if (equipo === 'barra') acumulado += 10000;
    return acumulado;
  }

  if (cantidadPersonas >= 50) {
    const servicio = productos.serviciosEvento.find((s) => s.id === tipoEvento);
    return servicio ? servicio.precioPersona * cantidadPersonas : 0;
  }

  return 0;
};

function App() {
  const [modalidad, setModalidad] = useState('barriles');
  const [tipoProducto, setTipoProducto] = useState('cerveza');
  const [tipoEvento, setTipoEvento] = useState('solo_cerveza');
  const [cantidadPersonas, setCantidadPersonas] = useState(50);

  const [litros, setLitros] = useState(10);
  const [conHielo, setConHielo] = useState(false);
  const [equipo, setEquipo] = useState('chopera');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [datos, setDatos] = useState({ nombre: '', dni: '', telefono: '', direccion: '', comentarios: '' });

  const [indexImagen, setIndexImagen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const imagenesActuales = useMemo(() => {
    if (modalidad === 'barriles') return equipo === 'chopera' ? imagenesChopera : imagenesBarra;
    return imagenesCarro;
  }, [modalidad, equipo]);

  const precioTotal = useMemo(
    () => calcularPrecioTotal({ modalidad, tipoProducto, tipoEvento, cantidadPersonas, litros, conHielo, equipo }),
    [modalidad, tipoProducto, tipoEvento, cantidadPersonas, litros, conHielo, equipo],
  );

  const stopInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setIndexImagen((prev) => (prev + 1) % imagenesActuales.length);
    }, 3000);
  }, [imagenesActuales.length, stopInterval]);

  useEffect(() => {
    if (!isPaused) startInterval();
    else stopInterval();

    return () => {
      stopInterval();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isPaused, startInterval, stopInterval]);

  const reiniciarSlider = () => {
    setIndexImagen(0);
    setIsPaused(false);
  };

  const handleModalidadChange = (nuevaModalidad) => {
    setModalidad(nuevaModalidad);
    reiniciarSlider();
  };

  const handleEquipoChange = (nuevoEquipo) => {
    setEquipo(nuevoEquipo);
    reiniciarSlider();
  };

  const handleUserInteraction = (manualIndex = null) => {
    setIsPaused(true);
    if (manualIndex !== null) setIndexImagen(manualIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPaused(false), 10000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const finalizarPedido = () => {
    if (modalidad === 'eventos' && cantidadPersonas < 50) {
      window.alert('Mínimo de personas: el servicio requiere 50 personas.');
      return;
    }

    if (!datos.nombre || !datos.direccion || !fechaSeleccionada || !datos.dni || !datos.telefono) {
      window.alert('¡Faltan datos! Completá la información para la entrega.');
      return;
    }

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    const senaCalculada = precioTotal * 0.3;
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

    const textoMensaje = `*NUEVA RESERVA BEER RENT* 🍻\n\n*Cliente:* ${datos.nombre}\n${detallePedido}\n--------------------------\n*TOTAL:* $${precioTotal.toLocaleString('es-AR')}\n*SEÑA (30%):* $${senaCalculada.toLocaleString('es-AR')}\n--------------------------\n*Fecha:* ${fechaTexto}\n*Dirección:* ${datos.direccion}\n*Tel:* ${datos.telefono}\n*Comentarios:* ${datos.comentarios || 'Sin comentarios'}`;

    const confirmar = window.confirm(
      `Total: $${precioTotal.toLocaleString('es-AR')}\nSeña (30%): $${senaCalculada.toLocaleString('es-AR')}\nAlias: ${ALIAS_MP}\n\n¿Querés enviar el pedido por WhatsApp?`,
    );

    if (confirmar) {
      window.open(`https://wa.me/${NUMERO_DUENIO}?text=${encodeURIComponent(textoMensaje)}`, '_blank');
    }
  };

  return (
    <div className="layout-master">
      <header className="header-pro-slim">
        <div className="header-limit">
          <div className="header-content-slim">
            <img src="/logo.png" alt="Logo" className="logo-img-slim" />
            <h1 className="logo-text-slim">Beer Rent</h1>
          </div>
        </div>
      </header>

      <div className="content-grid-stable">
        <aside className="sidebar-static">
          <div className="photo-sticky-box">
            <div className="slider-container-fixed" onClick={() => handleUserInteraction()}>
              <AnimatePresence mode="wait">
                <img key={imagenesActuales[indexImagen]} src={imagenesActuales[indexImagen]} className="img-full-render" />
              </AnimatePresence>
            </div>
          </div>
        </aside>

        <main className="form-area">
          <div className="form-card-premium">
            <label className="label-gold">
              <ShoppingCart size={18} /> 1. Seleccioná el Servicio
            </label>
            <div className="btn-row">
              <button className={`btn-opt ${modalidad === 'barriles' ? 'active' : ''}`} onClick={() => handleModalidadChange('barriles')}>
                ALQUILER BARRIL
              </button>
              <button className={`btn-opt ${modalidad === 'eventos' ? 'active' : ''}`} onClick={() => handleModalidadChange('eventos')}>
                CARRO / BARRA
              </button>
            </div>

            <AnimatePresence mode="wait">
              {modalidad === 'barriles' ? (
                <div key="barriles">
                  <label className="label-gold">
                    <Beer size={18} /> 2. ¿Qué vas a tomar?
                  </label>
                  <div className="btn-row">
                    <button className={`btn-opt ${tipoProducto === 'cerveza' ? 'active' : ''}`} onClick={() => setTipoProducto('cerveza')}>
                      CERVEZA
                    </button>
                    <button className={`btn-opt ${tipoProducto === 'gin' ? 'active' : ''}`} onClick={() => setTipoProducto('gin')}>
                      GIN TIRADO
                    </button>
                  </div>
                  <label className="label-gold">
                    <Info size={18} /> 3. Tamaño del Barril
                  </label>
                  <select value={litros} onChange={(e) => setLitros(Number(e.target.value))} className="input-custom">
                    {productos[tipoProducto].map((b) => (
                      <option key={b.id} value={b.litros}>
                        Barril de {b.litros}L — ${b.precio.toLocaleString('es-AR')}
                      </option>
                    ))}
                  </select>
                  <label className="label-gold">4. Hielo y Equipo</label>
                  <div className="btn-row">
                    <select value={String(conHielo)} onChange={(e) => setConHielo(e.target.value === 'true')} className="input-custom-half">
                      <option value="false">Sin Hielo</option>
                      <option value="true">Con Hielo (+$12.000)</option>
                    </select>
                    <select value={equipo} onChange={(e) => handleEquipoChange(e.target.value)} className="input-custom-half">
                      <option value="chopera">Chopera (Bonificada)</option>
                      <option value="barra">Barra Móvil (+$10.000)</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div key="eventos">
                  <label className="label-gold">
                    <Users size={18} /> 2. Tipo de Servicio
                  </label>
                  <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)} className="input-custom">
                    {productos.serviciosEvento.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre} — ${s.precioPersona.toLocaleString('es-AR')} p/p
                      </option>
                    ))}
                  </select>
                  <p className="desc-box">{productos.serviciosEvento.find((s) => s.id === tipoEvento)?.desc}</p>
                  <label className="label-gold">3. Cantidad de Personas</label>
                  <input
                    type="number"
                    className="input-custom"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(parseInt(e.target.value, 10) || 0)}
                    min="50"
                  />
                </div>
              )}
            </AnimatePresence>

            <label className="label-gold">
              <User size={18} /> Datos de Entrega
            </label>
            <input type="text" name="nombre" placeholder="Nombre Completo" onChange={handleInputChange} className="input-custom" />
            <div className="btn-row">
              <input type="text" name="dni" placeholder="DNI" onChange={handleInputChange} className="input-custom-half" />
              <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleInputChange} className="input-custom-half" />
            </div>
            <input type="text" name="direccion" placeholder="Dirección del Evento" onChange={handleInputChange} className="input-custom" />

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

            <div className="summary-card">
              <h2 className="price-display">${precioTotal.toLocaleString('es-AR')}</h2>
              <button onClick={finalizarPedido} className="btn-confirm">
                SOLICITAR RESERVA 🍺
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

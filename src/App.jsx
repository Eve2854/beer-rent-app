import React, { useState, useEffect, useRef } from 'react';
import { productos } from './datosCerveza';
import Swal from 'sweetalert2'; 
import DatePicker, { registerLocale } from 'react-datepicker'; 
import es from 'date-fns/locale/es'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Beer, Calendar, User, MapPin, Phone, Info, ShoppingCart, Users, CheckCircle, AlertCircle } from 'lucide-react'; 
import confetti from 'canvas-confetti'; 
import "react-datepicker/dist/react-datepicker.css"; 
import './App.css';

registerLocale('es', es);

function App() {
  const [modalidad, setModalidad] = useState("barriles");
  const [tipoProducto, setTipoProducto] = useState("cerveza");
  const [tipoEvento, setTipoEvento] = useState("solo_cerveza");
  const [cantidadPersonas, setCantidadPersonas] = useState(50);
  
  const [litros, setLitros] = useState(10);
  const [conHielo, setConHielo] = useState(false);
  const [equipo, setEquipo] = useState("chopera"); 
  const [precioTotal, setPrecioTotal] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [datos, setDatos] = useState({ 
    nombre: '', dni: '', telefono: '', direccion: '', comentarios: '' 
  });

  const [indexImagen, setIndexImagen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null); 

  const imagenesChopera = ["/barril1.jpg", "/barril2.jpg", "/barril4.jpg", "/barril5.jpg"];
  const imagenesBarra = ["/barra1.jpg", "/barra2.jpg", "/barra3.jpg"];
  const imagenesCarro = ["/carro1.jpeg", "/carro2.jpeg", "/carro3.jpeg", "/carro4.jpeg"];

  let imagenesActuales = modalidad === "barriles" 
    ? (equipo === "chopera" ? imagenesChopera : imagenesBarra)
    : imagenesCarro;

  const startInterval = () => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      setIndexImagen((prev) => (prev + 1) % imagenesActuales.length);
    }, 3000);
  };

  const stopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleUserInteraction = (manualIndex = null) => {
    setIsPaused(true);
    if (manualIndex !== null) setIndexImagen(manualIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPaused(false), 10000);
  };

  useEffect(() => {
    if (!isPaused) startInterval();
    else stopInterval();
    return () => stopInterval();
  }, [imagenesActuales, isPaused]);

  useEffect(() => {
    setIndexImagen(0);
    setIsPaused(false);
  }, [modalidad, equipo]);

  const ALIAS_MP = "MonD..";

  useEffect(() => {
    let acumulado = 0;
    if (modalidad === "barriles") {
      const listaSeleccionada = productos[tipoProducto];
      const item = listaSeleccionada.find(b => b.litros === parseInt(litros));
      acumulado = item ? item.precio : 0;
      if (conHielo) acumulado += 12000;
      if (equipo === "barra") acumulado += 10000;
    } else {
      if (cantidadPersonas >= 50) {
        const servicio = productos.serviciosEvento.find(s => s.id === tipoEvento);
        acumulado = servicio ? servicio.precioPersona * cantidadPersonas : 0;
      }
    }
    setPrecioTotal(acumulado);
  }, [modalidad, tipoProducto, tipoEvento, cantidadPersonas, litros, conHielo, equipo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  };

  const finalizarPedido = () => {
    if (modalidad === "eventos" && cantidadPersonas < 50) {
        Swal.fire({ icon: 'error', title: 'Mínimo de personas', text: 'El servicio requiere 50 personas.', confirmButtonColor: '#d4a017', background: '#111', color: '#fff' });
        return;
    }
    if (!datos.nombre || !datos.direccion || !fechaSeleccionada || !datos.dni || !datos.telefono) {
      Swal.fire({ icon: 'warning', title: '¡Faltan datos!', text: 'Completá la información para la entrega.', confirmButtonColor: '#d4a017', background: '#111', color: '#fff' });
      return;
    }

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    const senaCalculada = precioTotal * 0.3;
    const numeroDuenio = "542235599863"; 
    const fechaTexto = fechaSeleccionada.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    let detallePedido = modalidad === "barriles" 
      ? `*Producto:* ${tipoProducto.toUpperCase()} (${litros}L)\n*Equipo:* ${equipo}` 
      : `*Servicio:* ${productos.serviciosEvento.find(s => s.id === tipoEvento).nombre}\n*Personas:* ${cantidadPersonas}`;
    
    let textoMensaje = `*NUEVA RESERVA BEER RENT* 🍻\n\n*Cliente:* ${datos.nombre}\n${detallePedido}\n--------------------------\n*TOTAL:* $${precioTotal.toLocaleString('es-AR')}\n*SEÑA (30%):* $${senaCalculada.toLocaleString('es-AR')}\n--------------------------\n*Fecha:* ${fechaTexto}\n*Dirección:* ${datos.direccion}\n*Tel:* ${datos.telefono}\n*Comentarios:* ${datos.comentarios || 'Sin comentarios'}`;

    Swal.fire({
      title: '¡Todo listo! 🍻',
      html: `Total: <b>$${precioTotal.toLocaleString('es-AR')}</b>.<br>Seña (30%): <b style="color:#d4a017;">$${senaCalculada.toLocaleString('es-AR')}</b><br>Alias: <b>${ALIAS_MP}</b>`,
      showCancelButton: true, confirmButtonText: 'ENVIAR WHATSAPP 🍺', confirmButtonColor: '#d4a017', background: '#111', color: '#fff'
    }).then((result) => { if (result.isConfirmed) window.open(`https://wa.me/${numeroDuenio}?text=${encodeURIComponent(textoMensaje)}`, '_blank'); });
  };

  return (
    <div className="layout-master">
      <header className="header-pro-slim">
        <div className="header-limit">
          <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="header-content-slim">
            <img src="/logo.png" alt="Logo" className="logo-img-slim" />
            <h1 className="logo-text-slim">Beer Rent</h1>
          </motion.div>
        </div>
      </header>

      <div className="content-grid-stable">
        <aside className="sidebar-static">
          <div className="photo-sticky-box">
            <div className="slider-container-fixed" onClick={() => handleUserInteraction()}>
              <AnimatePresence mode="wait">
                <motion.img 
                  key={imagenesActuales[indexImagen]}
                  src={imagenesActuales[indexImagen]} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="img-full-render" 
                />
              </AnimatePresence>
            </div>
          </div>
        </aside>

        <main className="form-area">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-card-premium">
            <label className="label-gold"><ShoppingCart size={18} /> 1. Seleccioná el Servicio</label>
            <div className="btn-row">
              <button className={`btn-opt ${modalidad === 'barriles' ? 'active' : ''}`} onClick={() => setModalidad('barriles')}> ALQUILER BARRIL </button>
              <button className={`btn-opt ${modalidad === 'eventos' ? 'active' : ''}`} onClick={() => setModalidad('eventos')}> CARRO / BARRA </button>
            </div>

            <AnimatePresence mode="wait">
              {modalidad === 'barriles' ? (
                <motion.div key="barriles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label className="label-gold"><Beer size={18} /> 2. ¿Qué vas a tomar?</label>
                  <div className="btn-row">
                    <button className={`btn-opt ${tipoProducto === 'cerveza' ? 'active' : ''}`} onClick={() => setTipoProducto('cerveza')}>CERVEZA</button>
                    <button className={`btn-opt ${tipoProducto === 'gin' ? 'active' : ''}`} onClick={() => setTipoProducto('gin')}>GIN TIRADO</button>
                  </div>
                  <label className="label-gold"><Info size={18} /> 3. Tamaño del Barril</label>
                  <select value={litros} onChange={(e) => setLitros(e.target.value)} className="input-custom">
                    {productos[tipoProducto].map(b => (
                      <option key={b.id} value={b.litros}>Barril de {b.litros}L — ${b.precio.toLocaleString('es-AR')}</option>
                    ))}
                  </select>
                  <label className="label-gold">4. Hielo y Equipo</label>
                  <div className="btn-row">
                    <select onChange={(e) => setConHielo(e.target.value === "true")} className="input-custom-half">
                      <option value="false">Sin Hielo</option>
                      <option value="true">Con Hielo (+$12.000)</option>
                    </select>
                    <select value={equipo} onChange={(e) => setEquipo(e.target.value)} className="input-custom-half">
                      <option value="chopera">Chopera (Bonificada)</option>
                      <option value="barra">Barra Móvil (+$10.000)</option>
                    </select>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="eventos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <label className="label-gold"><Users size={18} /> 2. Tipo de Servicio</label>
                  <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)} className="input-custom">
                    {productos.serviciosEvento.map(s => (
                      <option key={s.id} value={s.id}>{s.nombre} — ${s.precioPersona.toLocaleString('es-AR')} p/p</option>
                    ))}
                  </select>
                  <p className="desc-box">
                    {productos.serviciosEvento.find(s => s.id === tipoEvento)?.desc}
                  </p>
                  <label className="label-gold">3. Cantidad de Personas</label>
                  <input type="number" className="input-custom" value={cantidadPersonas} onChange={(e) => setCantidadPersonas(parseInt(e.target.value) || 0)} min="50" />
                </motion.div>
              )}
            </AnimatePresence>

            <label className="label-gold"><User size={18} /> Datos de Entrega</label>
            <input type="text" name="nombre" placeholder="Nombre Completo" onChange={handleInputChange} className="input-custom" />
            <div className="btn-row">
                <input type="text" name="dni" placeholder="DNI" onChange={handleInputChange} className="input-custom-half" />
                <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleInputChange} className="input-custom-half" />
            </div>
            <input type="text" name="direccion" placeholder="Dirección del Evento" onChange={handleInputChange} className="input-custom" />
            
            <label className="label-gold"><Calendar size={18} /> Fecha y Hora</label>
            <DatePicker selected={fechaSeleccionada} onChange={(date) => setFechaSeleccionada(date)} showTimeSelect timeFormat="HH:mm" timeIntervals={30} dateFormat="dd/MM/yyyy HH:mm 'hs'" placeholderText="Seleccioná día y hora" className="input-custom" locale="es" minDate={new Date()} />

            <div className="info-final">
              {modalidad === 'barriles' ? (
                <div className="info-content animate-fade">
                  <p><b>Reserva de fecha:</b><br/>
                  Para asegurar la fecha solicitamos una seña del <b>30% del total</b>.<br/>
                  La reserva queda confirmada una vez recibido el comprobante ❤️</p>
                  <p className="cancelacion-text"><i>(En caso de cancelación, la seña no es reembolsable ya que se bloquea la fecha y se organiza la producción).</i></p>
                  <p>Trabajamos para cumpleaños, casamientos y todo tipo de eventos 🥳🍻</p>
                </div>
              ) : (
                <div className="info-content animate-fade">
                  <p><b>Reserva de fecha:</b><br/>
                  Para asegurar la fecha pedimos una seña del <b>30% del total</b>. 
                  Una semana antes del evento debe abonarse el saldo restante.</p>
                  <p className="cancelacion-text"><i>(En caso de cancelación, la seña no es reembolsable ya que se bloquea la fecha y se organiza la producción).</i></p>
                  <p>Trabajamos para cumpleaños, casamientos, eventos y todo tipo de reuniones. 
                  <b> Dejamos todo listo para que ustedes solo tengan que disfrutar.</b> ✨🍻</p>
                </div>
              )}
            </div>

            <div className="summary-card">
              <h2 className="price-display">${precioTotal.toLocaleString('es-AR')}</h2>
              <button onClick={finalizarPedido} className="btn-confirm">SOLICITAR RESERVA 🍺</button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
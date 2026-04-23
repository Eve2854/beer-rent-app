import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { productos } from './datosCerveza';
import './App.css';
import 'react-datepicker/dist/react-datepicker.css';

import Header from './components/Header';
import ImageSlider from './components/ImageSlider';
import ServiceSelector from './components/ServiceSelector';
import DeliveryForm from './components/DeliveryForm';
import ReservationInfo from './components/ReservationInfo';
import PriceSummary from './components/PriceSummary';
import Footer from './components/Footer';
import PromoVideo from './components/PromoVideo';

import { useImageSlider } from './hooks/useImageSlider';
import { calcularPrecioTotal } from './utils/pricing';
import { buildOrderMessage } from './utils/orderMessage';
import { ALIAS_MP, IMAGENES_BARRA, IMAGENES_CARRO, IMAGENES_CHOPERA, MP_BACKEND_URL, NUMERO_DUENIO, VIDEO_PROMOS } from './constants/appConstants';

function App() {
  const [modalidad, setModalidad] = useState('barriles');

  
  // Estado para selección múltiple de barriles
  const [seleccionBarriles, setSeleccionBarriles] = useState({
    cerveza: { activo: true, litros: 10, estilo: 'golden' },
    gin: { activo: false, litros: 10 }
  });

  const [tipoEvento, setTipoEvento] = useState('solo_cerveza');
  const [cantidadPersonas, setCantidadPersonas] = useState(50);
  const [conHielo, setConHielo] = useState(false);
  const [equipo, setEquipo] = useState('chopera');
  const [metodoEnvio, setMetodoEnvio] = useState('coordinar');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [datos, setDatos] = useState({ nombre: '', dni: '', telefono: '', direccion: '', comentarios: '' });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { imagenesActuales, indexImagen, handleUserInteraction, reiniciarSlider, isPaused } = useImageSlider({
    modalidad,
    equipo,
    imagenesChopera: IMAGENES_CHOPERA,
    imagenesBarra: IMAGENES_BARRA,
    imagenesCarro: IMAGENES_CARRO,
  });

  // Cálculo del precio total (Llamando a la utilidad pricing.js)
  const precioTotal = useMemo(
    () =>
      calcularPrecioTotal({
        productos,
        modalidad,
        seleccionBarriles,
        tipoEvento,
        cantidadPersonas,
        conHielo,
        equipo,
      }),
    [modalidad, seleccionBarriles, tipoEvento, cantidadPersonas, conHielo, equipo],
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const iniciarPago = async (tipo) => {
    try {
      const title = `Reserva ${modalidad === 'barriles' ? 'Barriles' : 'Eventos'} - ${datos.nombre || 'Cliente'}`;
      const response = await fetch(`${MP_BACKEND_URL}/api/mercadopago/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          unit_price: Number(precioTotal),
          quantity: 1,
          payer: {
            name: datos.nombre || undefined,
            phone: datos.telefono ? { number: datos.telefono } : undefined,
          },
          metadata: { metodo_pago: tipo },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        const detalle = data?.details?.message || data?.details?.cause || 'No se pudo crear el pago.';
        throw new Error(typeof detalle === 'string' ? detalle : 'No se pudo crear el pago.');
      }
      const url = data.init_point || data.sandbox_init_point;
      if (url) {
        window.open(url, '_blank');
        return;
      }
      throw new Error('Link de pago no disponible.');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Pago no disponible',
        text: err?.message || 'No se pudo abrir el link de pago. Intenta nuevamente.',
        background: '#111',
        color: '#fff',
      });
    }
  };

  const crearEventoCalendario = async () => {
    if (!fechaSeleccionada) return;
    const inicio = fechaSeleccionada;
    const fin = new Date(fechaSeleccionada.getTime() + 2 * 60 * 60 * 1000);
    const resumen = `Reserva ${modalidad === 'barriles' ? 'Barriles' : 'Eventos'} - ${datos.nombre || 'Cliente'}`;
    const detalle = `Nombre: ${datos.nombre}\nTelefono: ${datos.telefono}\nDireccion: ${datos.direccion}\nModalidad: ${modalidad}\nMetodo envio: ${metodoEnvio}\nMetodo pago: ${metodoPago}\nTotal: $${precioTotal.toLocaleString('es-AR')}\nSeña (30%): $${(precioTotal * 0.3).toLocaleString('es-AR')}`;

    try {
      const response = await fetch(`${MP_BACKEND_URL}/api/google/calendar/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: resumen,
          description: detalle,
          location: datos.direccion,
          start: inicio.toISOString(),
          end: fin.toISOString(),
          timeZone: 'America/Argentina/Buenos_Aires',
        }),
      });
      if (!response.ok) {
        throw new Error('No se pudo crear el evento en Google Calendar.');
      }
    } catch (_err) {
      Swal.fire({
        icon: 'warning',
        title: 'Calendario no conectado',
        text: 'No se pudo crear el evento. Conecta Google Calendar desde el footer.',
        background: '#111',
        color: '#fff',
      });
    }
  };

  // --- EFECTO VISUAL DE CONFETI ---
  const lanzarConfeti = () => {
    const duration = 3000;
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
  };

  const finalizarPedido = () => {
    // Validaciones de negocio
    if (modalidad === 'barriles' && !seleccionBarriles.cerveza.activo && !seleccionBarriles.gin.activo) {
      Swal.fire({ icon: 'error', title: 'Pedido vacío', text: 'Seleccioná al menos un producto.', background: '#111', color: '#fff' });
      return;
    }

    if (modalidad === 'eventos' && cantidadPersonas < 50) {
      Swal.fire({
        icon: 'error',
        title: 'Mínimo de personas',
        text: 'El servicio de Carro + Barra requiere al menos 50 personas.',
        confirmButtonColor: '#d4a017',
        background: '#111',
        color: '#fff',
      });
      return;
    }

    if (!datos.nombre || !datos.direccion || !fechaSeleccionada || !datos.dni || !datos.telefono) {
      Swal.fire({
        icon: 'warning',
        title: '¡Faltan datos!',
        text: 'Completá la información de contacto y entrega.',
        confirmButtonColor: '#d4a017',
        background: '#111',
        color: '#fff',
      });
      return;
    }

    // Si todo está bien, lanzamos la celebración
    lanzarConfeti();

    const senaCalculada = precioTotal * 0.3;

    // Construcción del mensaje para WhatsApp y Calendario
    const textoMensaje = buildOrderMessage({
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
    });

    Swal.fire({
      title: '¡Reserva confirmada! 🍻',
      html: `Total: <b>$${precioTotal.toLocaleString('es-AR')}</b>.<br>Seña para reservar (30%): <b style="color:#d4a017;">$${senaCalculada.toLocaleString('es-AR')}</b><br>Alias Mercado Pago: <b>${ALIAS_MP}</b>`,
      showCancelButton: true,
      confirmButtonText: 'ENVIAR A WHATSAPP 🍺',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#d4a017',
      background: '#111',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        crearEventoCalendario();
        window.open(`https://wa.me/${NUMERO_DUENIO}?text=${encodeURIComponent(textoMensaje)}`, '_blank');
      }
    });
  };

  return (
    <div className="layout-master">
      <Header />
      <PromoVideo sources={VIDEO_PROMOS} />

      <div className="content-grid-stable">
        <ImageSlider 
          imagenesActuales={imagenesActuales} 
          indexImagen={indexImagen} 
          onInteraction={handleUserInteraction} 
          isPaused={isPaused} 
        />

        <main className="form-area">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-card-premium">
            <ServiceSelector
              modalidad={modalidad}
              setModalidad={(v) => { setModalidad(v); reiniciarSlider(); }}
              seleccionBarriles={seleccionBarriles}
              setSeleccionBarriles={setSeleccionBarriles}
              conHielo={conHielo}
              setConHielo={setConHielo}
              equipo={equipo}
              setEquipo={(v) => { setEquipo(v); reiniciarSlider(); }}
              metodoEnvio={metodoEnvio}
              setMetodoEnvio={setMetodoEnvio}
              tipoEvento={tipoEvento}
              setTipoEvento={setTipoEvento}
              cantidadPersonas={cantidadPersonas}
              setCantidadPersonas={setCantidadPersonas}
              productos={productos}
            />

            <DeliveryForm
              datos={datos}
              onInputChange={handleInputChange}
              fechaSeleccionada={fechaSeleccionada}
              setFechaSeleccionada={setFechaSeleccionada}
              metodoPago={metodoPago}
              setMetodoPago={setMetodoPago}
              onPagarAhora={iniciarPago}
            />

            <ReservationInfo modalidad={modalidad} />
            <PriceSummary
              precioTotal={precioTotal}
              onConfirm={finalizarPedido}
              termsAccepted={termsAccepted}
              onToggleTerms={setTermsAccepted}
            />
          </motion.div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;

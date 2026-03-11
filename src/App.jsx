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

import { useImageSlider } from './hooks/useImageSlider';
import { calcularPrecioTotal } from './utils/pricing';
import { buildOrderMessage } from './utils/orderMessage';
import { ALIAS_MP, IMAGENES_BARRA, IMAGENES_CARRO, IMAGENES_CHOPERA, NUMERO_DUENIO } from './constants/appConstants';

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

  const { imagenesActuales, indexImagen, handleUserInteraction, reiniciarSlider } = useImageSlider({
    modalidad,
    equipo,
    imagenesChopera: IMAGENES_CHOPERA,
    imagenesBarra: IMAGENES_BARRA,
    imagenesCarro: IMAGENES_CARRO,
  });

  const precioTotal = useMemo(
    () =>
      calcularPrecioTotal({
        productos,
        modalidad,
        tipoProducto,
        tipoEvento,
        cantidadPersonas,
        litros,
        conHielo,
        equipo,
      }),
    [modalidad, tipoProducto, tipoEvento, cantidadPersonas, litros, conHielo, equipo],
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const finalizarPedido = () => {
    if (modalidad === 'eventos' && cantidadPersonas < 50) {
      Swal.fire({
        icon: 'error',
        title: 'Mínimo de personas',
        text: 'El servicio requiere 50 personas.',
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
        text: 'Completá la información para la entrega.',
        confirmButtonColor: '#d4a017',
        background: '#111',
        color: '#fff',
      });
      return;
    }

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

    const senaCalculada = precioTotal * 0.3;

    const textoMensaje = buildOrderMessage({
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
    });

    Swal.fire({
      title: '¡Todo listo! 🍻',
      html: `Total: <b>$${precioTotal.toLocaleString('es-AR')}</b>.<br>Seña (30%): <b style="color:#d4a017;">$${senaCalculada.toLocaleString(
        'es-AR',
      )}</b><br>Alias: <b>${ALIAS_MP}</b>`,
      showCancelButton: true,
      confirmButtonText: 'ENVIAR WHATSAPP 🍺',
      confirmButtonColor: '#d4a017',
      background: '#111',
      color: '#fff',
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(`https://wa.me/${NUMERO_DUENIO}?text=${encodeURIComponent(textoMensaje)}`, '_blank');
      }
    });
  };

  const handleModalidadChange = (value) => {
    setModalidad(value);
    reiniciarSlider();
  };

  const handleEquipoChange = (value) => {
    setEquipo(value);
    reiniciarSlider();
  };

  return (
    <div className="layout-master">
      <Header />

      <div className="content-grid-stable">
        <ImageSlider imagenesActuales={imagenesActuales} indexImagen={indexImagen} onInteraction={handleUserInteraction} />

        <main className="form-area">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="form-card-premium">
            <ServiceSelector
              modalidad={modalidad}
              setModalidad={handleModalidadChange}
              tipoProducto={tipoProducto}
              setTipoProducto={setTipoProducto}
              litros={litros}
              setLitros={setLitros}
              conHielo={conHielo}
              setConHielo={setConHielo}
              equipo={equipo}
              setEquipo={handleEquipoChange}
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
            />

            <ReservationInfo modalidad={modalidad} />
            <PriceSummary precioTotal={precioTotal} onConfirm={finalizarPedido} />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;
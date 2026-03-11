import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Beer, Info, ShoppingCart, Users } from 'lucide-react';

const ServiceSelector = ({
  modalidad,
  setModalidad,
  tipoProducto,
  setTipoProducto,
  litros,
  setLitros,
  conHielo,
  setConHielo,
  equipo,
  setEquipo,
  tipoEvento,
  setTipoEvento,
  cantidadPersonas,
  setCantidadPersonas,
  productos,
}) => (
  <>
    <label className="label-gold">
      <ShoppingCart size={18} /> 1. Seleccioná el Servicio
    </label>
    <div className="btn-row">
      <button className={`btn-opt ${modalidad === 'barriles' ? 'active' : ''}`} onClick={() => setModalidad('barriles')}>
        ALQUILER BARRIL
      </button>
      <button className={`btn-opt ${modalidad === 'eventos' ? 'active' : ''}`} onClick={() => setModalidad('eventos')}>
        CARRO / BARRA
      </button>
    </div>

    <AnimatePresence mode="wait">
      {modalidad === 'barriles' ? (
        <motion.div key="barriles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
            <select value={equipo} onChange={(e) => setEquipo(e.target.value)} className="input-custom-half">
              <option value="chopera">Chopera (Bonificada)</option>
              <option value="barra">Barra Móvil (+$10.000)</option>
            </select>
          </div>
        </motion.div>
      ) : (
        <motion.div key="eventos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
        </motion.div>
      )}
    </AnimatePresence>
  </>
);

export default ServiceSelector;
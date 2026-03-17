import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Beer, Info, ShoppingCart, Users, Truck, Check } from 'lucide-react';

const ServiceSelector = ({
  modalidad, setModalidad, seleccionBarriles, setSeleccionBarriles,
  conHielo, setConHielo, equipo, setEquipo, metodoEnvio, setMetodoEnvio,
  tipoEvento, setTipoEvento, cantidadPersonas, setCantidadPersonas, productos
}) => {

  const toggleProducto = (tipo) => {
    setSeleccionBarriles(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], activo: !prev[tipo].activo }
    }));
  };

  const updateLitros = (tipo, litros) => {
    setSeleccionBarriles(prev => ({
      ...prev,
      [tipo]: { ...prev[tipo], litros: Number(litros) }
    }));
  };

  const obtenerPrecioHieloActual = () => {
    let costoHielo = 0;
    if (seleccionBarriles.cerveza.activo) {
      costoHielo += seleccionBarriles.cerveza.litros === 10 ? 8000 : 16000;
    }
    return costoHielo;
  };

  useEffect(() => {
    if (seleccionBarriles.gin.activo && conHielo) {
      setConHielo(false);
    }
  }, [seleccionBarriles.gin.activo, conHielo, setConHielo]);

  return (
    <>
      <label className="label-gold"><ShoppingCart size={18} /> 1. Seleccioná el Servicio</label>
      <div className="btn-row">
        <button className={`btn-opt ${modalidad === 'barriles' ? 'active' : ''}`} onClick={() => setModalidad('barriles')}>ALQUILER BARRIL</button>
        <button className={`btn-opt ${modalidad === 'eventos' ? 'active' : ''}`} onClick={() => setModalidad('eventos')}>CARRO + BARRA</button>
      </div>

      <AnimatePresence mode="wait">
        {modalidad === 'barriles' ? (
          <motion.div key="barriles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <label className="label-gold"><Beer size={18} /> 2. ¿Qué vas a tomar?</label>
            <div className="selection-multi-container">
              <div className={`card-selection ${seleccionBarriles.cerveza.activo ? 'active' : ''}`} onClick={() => toggleProducto('cerveza')}>
                <div className="check-circle">{seleccionBarriles.cerveza.activo && <Check size={14}/>}</div>
                <span>CERVEZA</span>
              </div>
              <div className={`card-selection ${seleccionBarriles.gin.activo ? 'active' : ''}`} onClick={() => toggleProducto('gin')}>
                <div className="check-circle">{seleccionBarriles.gin.activo && <Check size={14}/>}</div>
                <span>GIN TIRADO</span>
              </div>
            </div>

            {seleccionBarriles.cerveza.activo && (
              <div className="animate-fade">
                <label className="label-gold"><Info size={18} /> Litros de Cerveza</label>
                <select value={seleccionBarriles.cerveza.litros} onChange={(e) => updateLitros('cerveza', e.target.value)} className="input-custom">
                  {productos.cerveza.map(b => (
                    <option key={b.id} value={b.litros}>Barril {b.litros}L — ${b.precio.toLocaleString('es-AR')}</option>
                  ))}
                </select>
              </div>
            )}

            {seleccionBarriles.gin.activo && (
              <div className="animate-fade">
                <label className="label-gold"><Info size={18} /> Litros de Gin</label>
                <select value={seleccionBarriles.gin.litros} onChange={(e) => updateLitros('gin', e.target.value)} className="input-custom">
                  {productos.gin.map(b => (
                    <option key={b.id} value={b.litros}>Barril {b.litros}L — ${b.precio.toLocaleString('es-AR')}</option>
                  ))}
                </select>
              </div>
            )}

            <label className="label-gold">4. Hielo y Equipo</label>
            <div className="btn-row">
              {seleccionBarriles.cerveza.activo && (
                <select value={String(conHielo)} onChange={(e) => setConHielo(e.target.value === 'true')} className="input-custom-half">
                  <option value="false">Sin Hielo</option>
                  <option value="true">Con Hielo (+${obtenerPrecioHieloActual().toLocaleString('es-AR')})</option>
                </select>
              )}
              {seleccionBarriles.gin.activo && (
                <div className="input-custom-half notice-box">Gin va sin hielo.</div>
              )}
              {!seleccionBarriles.cerveza.activo && !seleccionBarriles.gin.activo && (
                <select value={String(conHielo)} onChange={(e) => setConHielo(e.target.value === 'true')} className="input-custom-half">
                  <option value="false">Sin Hielo</option>
                  <option value="true">Con Hielo (+${obtenerPrecioHieloActual().toLocaleString('es-AR')})</option>
                </select>
              )}
              <select value={equipo} onChange={(e) => setEquipo(e.target.value)} className="input-custom-half">
                <option value="chopera">Chopera (Bonificada)</option>
                <option value="barra">Barra Móvil (+$10.000)</option>
              </select>
            </div>
              )}
              <select value={equipo} onChange={(e) => setEquipo(e.target.value)} className="input-custom-half">
                <option value="chopera">Chopera (Bonificada)</option>
                <option value="barra">Barra Móvil (+$10.000)</option>
              </select>
            </div>

            <label className="label-gold"><Truck size={18} /> 5. ENVIO Y RETIRO</label>
            <select value={metodoEnvio} onChange={(e) => setMetodoEnvio(e.target.value)} className="input-custom">
              <option value="coordinar">A coordinar / Retira cliente</option>
              <option value="domicilio">A domicilio (Costo varía según zona)</option>
            </select>
          </motion.div>
        ) : (
          <motion.div key="eventos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <label className="label-gold"><Users size={18} /> 2. Tipo de Servicio</label>
            <select value={tipoEvento} onChange={(e) => setTipoEvento(e.target.value)} className="input-custom">
              {productos.serviciosEvento.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre} — ${s.precioPersona.toLocaleString('es-AR')} por persona</option>
              ))}
            </select>
            <p className="desc-box">{productos.serviciosEvento.find((s) => s.id === tipoEvento)?.desc}</p>
            
            <label className="label-gold">3. Cantidad de Personas (Mínimo 50)</label>
            <input
              type="number"
              className="input-custom"
              placeholder="Ej: 50"
              value={cantidadPersonas === 0 ? '' : cantidadPersonas}
              onChange={(e) => {
                const val = e.target.value;
                setCantidadPersonas(val === '' ? 0 : parseInt(val, 10));
              }}
              min="50"
            />
            {cantidadPersonas > 0 && cantidadPersonas < 50 && (
              <p style={{ color: '#ff4444', fontSize: '0.8rem', marginTop: '5px' }}>
                * El servicio de eventos requiere un mínimo de 50 personas.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceSelector;



import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause } from 'lucide-react';

const ImageSlider = ({ imagenesActuales, indexImagen, onInteraction, isPaused }) => {
  
  // Función para ir a la imagen anterior
  const irAtras = (e) => {
    e.stopPropagation(); // Para que no dispare el click del contenedor
    const nuevoIndex = (indexImagen - 1 + imagenesActuales.length) % imagenesActuales.length;
    onInteraction(nuevoIndex);
  };

  // Función para ir a la imagen siguiente
  const irAdelante = (e) => {
    e.stopPropagation();
    const nuevoIndex = (indexImagen + 1) % imagenesActuales.length;
    onInteraction(nuevoIndex);
  };

  return (
    <aside className="sidebar-static">
      <div className="photo-sticky-box">
        <div 
          className="slider-container-fixed" 
          onClick={() => onInteraction()}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          {/* Cartel de Pausa Temporal */}
          <AnimatePresence>
            {isPaused && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', top: '20px', right: '20px',
                  backgroundColor: 'rgba(0,0,0,0.6)', padding: '8px',
                  borderRadius: '50%', zIndex: 20, border: '1px solid var(--gold)'
                }}
              >
                <Pause size={16} color="#d4a017" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flechas de Navegación */}
          <button onClick={irAtras} className="nav-arrow left">
            <ChevronLeft size={24} />
          </button>
          <button onClick={irAdelante} className="nav-arrow right">
            <ChevronRight size={24} />
          </button>

          {/* Imagen con Animación */}
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

          {/* Puntos de paginación (Selectors) */}
          <div className="slider-dots">
            {imagenesActuales.map((_, i) => (
              <div 
                key={i} 
                className={`dot ${i === indexImagen ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onInteraction(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ImageSlider;
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Volume2, VolumeX } from 'lucide-react';

const isVideoSrc = (src) => typeof src === 'string' && /\.(mp4|webm|ogg)$/i.test(src);

const ImageSlider = ({ imagenesActuales, indexImagen, onInteraction, isPaused }) => {
  const srcActual = imagenesActuales[indexImagen];
  const esVideo = isVideoSrc(srcActual);
  const videoRef = useRef(null);

  // Nota: los navegadores suelen bloquear autoplay con audio. Arrancamos en mute y
  // al primer toque del usuario habilitamos sonido.
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (!esVideo) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = !audioEnabled;
    if (audioEnabled) {
      // Intentamos reproducir con audio tras interacción del usuario.
      video.play().catch(() => {});
    }
  }, [esVideo, audioEnabled, srcActual]);

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
          onClick={() => {
            // Cualquier interacción del usuario nos permite habilitar audio en el video.
            if (esVideo && !audioEnabled) setAudioEnabled(true);
            onInteraction();
          }}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          {/* Cartel de pausa temporal */}
          <AnimatePresence>
            {isPaused && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '8px',
                  borderRadius: '50%',
                  zIndex: 20,
                  border: '1px solid var(--gold)',
                }}
              >
                <Pause size={16} color="#d4a017" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Flechas de navegación */}
          <button onClick={irAtras} className="nav-arrow left" type="button">
            <ChevronLeft size={24} />
          </button>
          <button onClick={irAdelante} className="nav-arrow right" type="button">
            <ChevronRight size={24} />
          </button>

          {/* Toggle de sonido (solo para video) */}
          {esVideo && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setAudioEnabled((v) => !v);
              }}
              aria-label={audioEnabled ? 'Silenciar video' : 'Activar sonido del video'}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '8px',
                borderRadius: '50%',
                zIndex: 20,
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                cursor: 'pointer',
              }}
            >
              {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          )}

          {/* Media con animación (imagen o video) */}
          <AnimatePresence mode="wait">
            {esVideo ? (
              <motion.video
                key={srcActual}
                src={srcActual}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="img-full-render"
                autoPlay
                muted={!audioEnabled}
                loop
                playsInline
                preload="metadata"
                ref={videoRef}
              />
            ) : (
              <motion.img
                key={srcActual}
                src={srcActual}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="img-full-render"
                alt=""
                loading="lazy"
              />
            )}
          </AnimatePresence>

          {/* Puntos de paginación */}
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

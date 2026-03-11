import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ImageSlider = ({ imagenesActuales, indexImagen, onInteraction }) => (
  <aside className="sidebar-static">
    <div className="photo-sticky-box">
      <div className="slider-container-fixed" onClick={() => onInteraction()}>
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
);

export default ImageSlider;
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const useImageSlider = ({ modalidad, equipo, imagenesChopera, imagenesBarra, imagenesCarro }) => {
  const [indexImagen, setIndexImagen] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const imagenesActuales = useMemo(() => {
    if (modalidad === 'barriles') return equipo === 'chopera' ? imagenesChopera : imagenesBarra;
    return imagenesCarro;
  }, [modalidad, equipo, imagenesChopera, imagenesBarra, imagenesCarro]);

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

  const reiniciarSlider = useCallback(() => {
    setIndexImagen(0);
    setIsPaused(false);
  }, []);

  const handleUserInteraction = useCallback((manualIndex = null) => {
    setIsPaused(true);
    if (manualIndex !== null) setIndexImagen(manualIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsPaused(false), 10000);
  }, []);

  return {
    imagenesActuales,
    indexImagen,
    handleUserInteraction,
    reiniciarSlider,
  };
};
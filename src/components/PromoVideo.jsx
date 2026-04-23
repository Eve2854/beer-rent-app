import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';

const PromoVideo = ({ sources }) => {
  const videoRef = useRef(null);
  const lista = useMemo(() => (Array.isArray(sources) ? sources.filter(Boolean) : []), [sources]);
  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [nativeW, setNativeW] = useState(null);
  const [nativeH, setNativeH] = useState(null);
  const playedOnceRef = useRef(Object.create(null));

  const src = lista[index] || null;

  useEffect(() => {
    // Si cambia la lista, mantenemos el index en rango.
    if (!lista.length) return;
    setIndex((i) => Math.max(0, Math.min(i, lista.length - 1)));
  }, [lista.length]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Reset size hints until metadata arrives.
    setNativeW(null);
    setNativeH(null);
    // Regla: primera vez con audio, segunda vez (y siguientes) muteado.
    // Ojo: algunos navegadores pueden bloquear autoplay con audio.
    const shouldMute = !!playedOnceRef.current[src];
    video.muted = shouldMute;
    setIsMuted(shouldMute);

    const onLoaded = () => {
      if (video.videoWidth && video.videoHeight) {
        setNativeW(video.videoWidth);
        setNativeH(video.videoHeight);
      }
    };
    const onPlay = () => {
      // Marcamos como "ya fue reproducido" en la primera reproducción real.
      if (!playedOnceRef.current[src]) playedOnceRef.current[src] = true;
    };
    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('play', onPlay);

    // Intento best-effort: reproducir. Si el navegador bloquea con audio, caemos a mute.
    const tryPlay = async () => {
      try {
        video.muted = shouldMute;
        await video.play();
      } catch (_e) {
        try {
          video.muted = true;
          setIsMuted(true);
          await video.play();
        } catch (_e2) {
          // El usuario puede tocar play desde los controles nativos si el browser lo exige.
        }
      }
    };

    tryPlay();

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('play', onPlay);
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  if (!src) return null;

  const irAtras = () => setIndex((i) => (i - 1 + lista.length) % lista.length);
  const irAdelante = () => setIndex((i) => (i + 1) % lista.length);
  const avanzarAutomatico = () => {
    if (lista.length <= 1) return;
    setIndex((i) => (i + 1) % lista.length);
  };
  const togglePause = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      try {
        await video.play();
      } catch (_e) {
        // Si el navegador lo bloquea, el usuario puede usar el play nativo si aparece.
      }
    } else {
      video.pause();
    }
  };

  return (
    <section className="promo-video-wrap" aria-label="Video promocional">
      <div
        className="promo-video-frame"
        onClick={togglePause}
        style={{
          // CSS vars para limitar el escalado y respetar el tamaño real del video.
          '--promo-native-w': nativeW ? `${nativeW}px` : '100%',
          '--promo-native-h': nativeH ? `${nativeH}px` : '70vh',
        }}
      >
        <video
          ref={videoRef}
          className="promo-video"
          src={src}
          playsInline
          preload="metadata"
          muted={isMuted}
          autoPlay
          onEnded={avanzarAutomatico}
        />

        <div className="promo-video-ui">
          <button
            type="button"
            className="promo-video-btn"
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((v) => !v);
            }}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {lista.length > 1 && (
            <>
              <button
                type="button"
                className="promo-video-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  irAtras();
                }}
                aria-label="Video anterior"
                title="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="promo-video-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  irAdelante();
                }}
                aria-label="Siguiente video"
                title="Siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoVideo;

import React, { useEffect, useRef } from 'react';
import './VideoLazy.css';

interface VideoLazyProps {
  src: string;
  poster: string;
  className?: string;
  ariaLabel?: string;
}

// Video decorativo que recién se descarga cuando se acerca a la pantalla.
// Con prefers-reduced-motion no se reproduce: queda el poster.
const VideoLazy: React.FC<VideoLazyProps> = ({ src, poster, className, ariaLabel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Si el navegador rechaza play() (iOS en bajo consumo), se reintenta con
    // el primer toque o clic en cualquier parte de la página.
    const reintentar = () => {
      video.play().catch(() => {});
    };
    const quitarReintento = () => {
      document.removeEventListener('touchstart', reintentar);
      document.removeEventListener('click', reintentar);
      video.removeEventListener('playing', quitarReintento);
    };

    let visible = false;
    let activo = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!video.getAttribute('src')) video.src = src;
          video.play().catch(() => {
            // Puede haber salido de pantalla mientras play() se resolvía
            if (!activo || !visible) return;
            quitarReintento();
            document.addEventListener('touchstart', reintentar, { once: true, passive: true });
            document.addEventListener('click', reintentar, { once: true });
            video.addEventListener('playing', quitarReintento, { once: true });
          });
        } else {
          // Fuera de pantalla no tiene sentido arrancarlo con un toque
          quitarReintento();
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => {
      activo = false;
      observer.disconnect();
      quitarReintento();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={['video-lazy', className].filter(Boolean).join(' ')}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  );
};

export default VideoLazy;

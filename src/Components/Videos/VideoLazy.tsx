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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute('src')) video.src = src;
          // Algunos navegadores rechazan play() en modo ahorro de energía
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(video);
    return () => observer.disconnect();
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

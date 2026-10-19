# Avance 04a — Análisis del material de Nico (videos y fotos)

Relevamiento de los originales que están en `material-nico/` (raíz del repo, ignorada por git). No se comprimió, recortó ni renombró nada, y no se tocó `src/`.

Herramienta: FFmpeg 9.0.2 (`winget install Gyan.FFmpeg`). Pesos en MB = 1.048.576 bytes.

## Videos

| Archivo | Ancho × alto (como se ve) | Orientación | Duración | FPS | Códec | Bitrate total (video / audio) | Peso | Audio | Hoja de contacto |
|---|---|---|---|---|---|---|---|---|---|
| `Espacios-1920.mp4` | 1080 × 1920 | Vertical (9:16) | 21,8 s | 25 | H.264 | 3.804 kbps (3.702 / 96) | 9,87 MB | Sí, AAC | [`04a-material/videos/Espacios-1920.jpg`](04a-material/videos/Espacios-1920.jpg) |
| `sillon 1-1920.mp4` | 1080 × 1920 | Vertical (9:16) | 33,1 s | 25 | H.264 | 4.177 kbps (4.074 / 96) | 16,47 MB | Sí, AAC | [`04a-material/videos/sillon 1-1920.jpg`](<04a-material/videos/sillon 1-1920.jpg>) |
| `Sillon 2-1920.mp4` | 1080 × 1920 | Vertical (9:16) | 39,2 s | 25 | H.264 | 4.247 kbps (4.145 / 96) | 19,85 MB | Sí, AAC | [`04a-material/videos/Sillon 2-1920.jpg`](<04a-material/videos/Sillon 2-1920.jpg>) |
| `VideoLindo.mp4` | 1080 × 1920 | Vertical (9:16) | 36,6 s | 30 | H.264 | 9.818 kbps (9.487 / 317) | 42,84 MB | Sí, AAC | [`04a-material/videos/VideoLindo.jpg`](04a-material/videos/VideoLindo.jpg) |

Cada hoja de contacto tiene 4 frames (10 %, 35 %, 65 % y 90 % de la duración), de 320 px de ancho cada uno: 1280 × 568 px en total.

**Qué se ve en cada uno** (según las hojas de contacto):

- **Espacios-1920**: recorrido del local sin gente. Sillones de corte con espejos de pie, lavacabezas, mostrador con productos Olaplex, sillón con araña de cristal y luz natural de ventana. Luminoso, tonos blancos y madera.
- **sillon 1-1920**: experiencia del cliente. Sillón reclinándose, manos con productos Olaplex, clienta tomando café, Nico peinando a una clienta en el sillón.
- **Sillon 2-1920**: misma sesión que el anterior: sillón reclinable, lavado de cabeza en primer plano, café servido en la mesa, Nico con la clienta. El último plano es el mismo que el de `sillon 1`.
- **VideoLindo**: otra producción, de estilo editorial. Modelos con vestidos negros sobre fondos con luz de color (violeta, magenta, azul). Tiene planos muy oscuros (el frame al 10 % es casi negro). No muestra el local.

Los cuatro tienen pista de audio con sonido real (volumen medio entre −17 y −11 dB). No son pistas mudas.

## Fotos

| Archivo | Ancho × alto (como se ve) | Orientación | Peso | Vista previa |
|---|---|---|---|---|
| `Nico WEB-1.jpg` | 1365 × 2048 | Vertical (2:3) | 1,04 MB | [`04a-material/fotos/Nico WEB-1.jpg`](<04a-material/fotos/Nico WEB-1.jpg>) |
| `Nico WEB-7.jpg` | 1365 × 2048 | Vertical (2:3) | 0,90 MB | [`04a-material/fotos/Nico WEB-7.jpg`](<04a-material/fotos/Nico WEB-7.jpg>) |
| `Nico WEB-14.jpg` | 1365 × 2048 | Vertical (2:3) | 0,81 MB | [`04a-material/fotos/Nico WEB-14.jpg`](<04a-material/fotos/Nico WEB-14.jpg>) |
| `Nico WEB-15.jpg` | 1365 × 2048 | Vertical (2:3) | 0,70 MB | [`04a-material/fotos/Nico WEB-15.jpg`](<04a-material/fotos/Nico WEB-15.jpg>) |
| `Nico WEB-17.jpg` | 1365 × 2048 | Vertical (2:3) | 0,89 MB | [`04a-material/fotos/Nico WEB-17.jpg`](<04a-material/fotos/Nico WEB-17.jpg>) |

Las vistas previas miden 534 × 800 px.

**Qué se ve en cada una:**

- **WEB-1**: sillones de corte con espejos de pie y araña. Local vacío, luz natural.
- **WEB-7**: lavacabezas y tocadores con espejos redondos. Local vacío, luz natural.
- **WEB-14**: Nico dando forma al pelo de una modelo con spray, con luz verde de fondo.
- **WEB-15**: Nico de espaldas acomodándole el pelo a la modelo, misma luz verde.
- **WEB-17**: retrato de la modelo, con la mano de Nico apenas en el cuadro, misma luz verde.

**Total: 4 videos y 5 fotos. Los originales pesan 93,36 MB (videos 89,02 MB + fotos 4,34 MB).**

---

## Decisiones durante la implementación

- **Rotación de videos:** se revisaron las side data de cada stream (`ffprobe -show_entries stream_side_data_list`) y ninguno trae matriz de rotación. Los cuatro están guardados en 1080 × 1920 de forma nativa, así que lo que se ve coincide con lo almacenado. Las hojas de contacto confirman que no hay nada acostado.
- **Orientación EXIF de fotos:** se leyó el tag `0x0112` directamente del bloque EXIF. Ninguna foto lo tiene: son exportaciones de Lightroom que ya vienen derechas. Igualmente, la vista previa se generó con FFmpeg, que aplica la orientación EXIF si existe.
- **Peso de las vistas previas:** se exportaron con `-q:v 4` (equivale a ~80 de calidad JPEG) y sin metadatos (`-map_metadata -1`). La más pesada ocupa 76 KB, muy por debajo del límite de 300 KB.
- **Frames del 10 % y 90 %:** se tomaron con `-ss` antes de cada entrada (búsqueda rápida), así que pueden caer unos cuadros antes o después del porcentaje exacto. Para una vista previa alcanza.
- **Chequeo de duplicados:** se compararon los hashes SHA-1 de los originales contra los assets de `src/Components/Imagenes/` (ver Pendientes).

## Desvíos respecto al brief

- **Ubicación del repo:** igual que en el brief 01, el repo está en `Nicolas-Sanetti-Front/NicolasSanetti-Front/`, y `material-nico/` estaba ahí mismo, al lado de `src/`. La carpeta de arriba no es un repo.
- **Datos adicionales:** se sumaron una descripción del contenido de cada video y foto y el volumen del audio, que el brief no pedía, para ayudar a decidir el layout del brief 04.
- No hubo subcarpetas dentro de `material-nico/`: los 9 archivos están en la raíz de esa carpeta.

## Pendientes o problemas

- **`Sillon 2-1920.mp4` ya está en la web:** es idéntico byte a byte a `src/Components/Imagenes/Lavado.mp4` (mismo SHA-1), que hoy importa `Services.tsx` sin comprimir (19,85 MB dentro del bundle). Conviene tenerlo en cuenta en el brief 04.
- **`sillon 1` y `Sillon 2` se solapan:** son de la misma sesión y terminan con el mismo plano. Probablemente alcance con usar uno de los dos, o un recorte de cada uno.
- **`VideoLindo.mp4` es el más pesado (42,8 MB, ~9,5 Mbps, 30 fps)** y tiene planos casi negros. Si se usa como portada, el póster no debería sacarse del principio del video.
- **Ningún material es horizontal.** Todo es vertical (videos 9:16, fotos 2:3). Un hero a pantalla completa en escritorio va a requerir recortar mucho (`object-fit: cover`) o un layout que contemple el formato vertical.
- **Créditos:** los metadatos de las fotos 1, 7, 15 y 17 tienen como autor (`Artist`) a Juan Cruz Acuña, con un campo de copyright a su nombre. Ver con Nico si hay que dar crédito al fotógrafo en la web.
- **Detalle previo, no tocado:** en `src/Components/Imagenes/` está versionado `TP_Parte1_Word_Santiago_Viale_EDITADO.docx`, que no tiene relación con el sitio. Habría que sacarlo en algún brief de limpieza.

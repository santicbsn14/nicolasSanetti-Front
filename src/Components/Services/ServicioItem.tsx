interface Precio {
    nombre: string;
    precio: string;
  }
  
  interface Servicio {
    titulo: string;
    descripcion: string;
    precios: Precio[];
    imagen: string;
    bgColor: string;
    reverse: boolean;
  }
  
  export const ServicioItem = ({ servicio }: { servicio: Servicio }) => {
    const { titulo, descripcion, precios, imagen, bgColor, reverse } = servicio;
  
    return (
      <div
        className="servicio"
        style={{ backgroundColor: bgColor }}
      >
        <div className={`servicio-content ${reverse ? "reverse" : ""}`}>
          <img src={imagen} alt={titulo} className="servicio-img" />
          <div className="servicio-texto">
            <h2>{titulo}</h2>
            <p>{descripcion}</p>
            <ul>
              {precios.map((item, index) => (
                <li key={index}>
                  <strong>{item.nombre}</strong>: {item.precio}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
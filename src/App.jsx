import { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";

function Inicio() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products/category/groceries?limit=6")
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        setProductos(datos.products);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  return (
    <main>
      <h1>Bienvenidos a PrecioCerca</h1>
      <p>Compará precios y encontrá productos cerca tuyo.</p>

      <h2>Productos destacados</h2>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="productos">
          {productos.map((producto) => (
            <article className="tarjeta" key={producto.id}>
              <img src={producto.thumbnail} alt={producto.title} />
              <h3>{producto.title}</h3>
              <p>{producto.description}</p>
              <strong>${producto.price}</strong>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

const productosLocales = [
  {
    id: 1,
    nombre: "Yerba mate",
    precio: 3500,
    imagen: "https://images.openfoodfacts.org/images/products/779/071/033/4603/front_en.15.200.jpg",
  },
  {
    id: 2,
    nombre: "Leche",
    precio: 1800,
   imagen: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    nombre: "Pan",
    precio: 2200,
    imagen: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
  },
];

function Productos() {
  return (
    <main>
      <h1>Productos de PrecioCerca</h1>
      <p>Estos productos se muestran desde una lista local de datos.</p>

      <div className="productos">
        {productosLocales.map((producto) => (
          <article className="tarjeta" key={producto.id}>
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>Precio de referencia</p>
            <strong>${producto.precio}</strong>
          </article>
        ))}
      </div>
    </main>
  );
}

function Contacto() {
  return (
    <main>
      <h1>Contactanos</h1>
      <p>Envianos tu consulta o sugerencia.</p>

      <div className="contacto">
        <form action="https://formsubmit.co/mariacastilloaides@gmail.com" method="POST">
          <input type="hidden" name="_subject" value="Mensaje desde PrecioCerca" />

          <label>Nombre</label>
          <input type="text" name="nombre" required />

          <label>Correo electrónico</label>
          <input type="email" name="email" required />

          <label>Mensaje</label>
          <textarea name="mensaje" required />

          <button type="submit">Enviar mensaje</button>
        </form>

        <iframe
          title="Mapa de Salta"
          src="https://maps.google.com/maps?q=Salta%20Argentina&output=embed"
          loading="lazy"
        ></iframe>
      </div>
    </main>
  );
}

function App() {
  return (
    <>
      <header>
        <h2>PrecioCerca</h2>
        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>

      <footer>
        <p>PrecioCerca - Compará y ahorrá.</p>
      </footer>
    </>
  );
}

export default App;
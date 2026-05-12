'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Bolsos Dama');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('/api/productos');
    const data = await res.json();
    setProductos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file ||!nombre ||!precio) {
      alert('Completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const blob = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(blob.error || 'Error subiendo imagen');

      const createRes = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          categoria,
          imagen: blob.url,
        }),
      });

      if (!createRes.ok) throw new Error('Error creando producto');

      const nuevoProducto = await createRes.json();
      setProductos(prev => [nuevoProducto,...prev]);

      setNombre('');
      setPrecio('');
      setFile(null);
      alert('Producto agregado');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return;

    const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setProductos(prev => prev.filter(p => p.id!== id));
      alert('Producto borrado');
    } else {
      alert('Error al borrar');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

        <div>
          <h2>📦 Nuevo Producto</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>NOMBRE DEL PRODUCTO</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>$ PRECIO</label>
              <input
                type="number"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>CATEGORÍA</label>
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option>Bolsos Dama</option>
                <option>Bolsos Caballero</option>
                <option>Accesorios</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>IMAGEN DEL PRODUCTO</label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#FFD700',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              {loading? 'Subiendo...' : 'Agregar Producto'}
            </button>
          </form>
        </div>

        <div>
          <h2>📦 Inventario ({productos.length})</h2>
          {productos.length === 0 && <p>No hay productos</p>}

          {productos.map(producto => (
            <div key={producto.id} style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '20px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '15px'
            }}>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 5px 0' }}>{producto.nombre}</h3>
                <p style={{ margin: '0 0 5px 0' }}>${producto.precio}</p>
                <p style={{ margin: 0, color: '#666' }}>{producto.categoria}</p>
              </div>
              <button
                onClick={() => handleDelete(producto.id)}
                style={{
                  color: 'red',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  alignSelf: 'flex-start'
                }}
              >
                Borrar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
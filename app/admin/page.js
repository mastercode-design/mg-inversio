'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Zap, Upload, Crown, Shirt, Briefcase, X, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const categorias = [
  { nombre: 'Bolsos Dama', icon: Briefcase },
  { nombre: 'Bolsos Caballero', icon: Briefcase },
  { nombre: 'Ropa Dama', icon: Shirt },
  { nombre: 'Ropa Caballero', icon: Shirt },
  { nombre: 'Accesorios', icon: Package }
];

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Bolsos Dama');
  const [premium, setPremium] = useState(false);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState({});

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch {
      toast.error('Error cargando productos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0 ||!nombre ||!precio) {
      toast.error('Completa todos los campos y sube al menos una imagen');
      return;
    }

    setLoading(true);
    try {
      const urls = []
      for (const file of files) {
        const uploadRes = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });
        const blob = await uploadRes.json();
        if (!uploadRes.ok) throw new Error('Error subiendo imagen')
        urls.push(blob.url)
      }

      const createRes = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          categoria,
          premium,
          imagenes: urls,
          imagen: urls[0],
        }),
      });

      if (!createRes.ok) throw new Error('Error creando producto');

      const nuevoProducto = await createRes.json();
      setProductos(prev => [nuevoProducto,...prev]);

      setNombre('');
      setPrecio('');
      setCategoria('Bolsos Dama');
      setPremium(false);
      setFiles([]);
      toast.success('Producto agregado correctamente');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este producto?')) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductos(prev => prev.filter(p => p.id!== id));
        toast.success('Producto eliminado');
      }
    } catch {
      toast.error('Error al borrar');
    }
  };

  const cambiarImagen = (prodId, dir, total) => {
    setIndiceImagen(prev => {
      const actual = prev[prodId] || 0
      let nuevo = actual + dir
      if (nuevo < 0) nuevo = total - 1
      if (nuevo >= total) nuevo = 0
      return {...prev, [prodId]: nuevo }
    })
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,255,0.15),transparent_50%)]" />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
          </div>
          <a href="/" className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 font-bold">
            Ver Tienda
          </a>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Nuevo Producto
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre del producto"
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />

              <input
                type="number"
                value={precio}
                onChange={e => setPrecio(e.target.value)}
                placeholder="Precio"
                className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />

              <div className="grid grid-cols-2 gap-2">
                {categorias.map(cat => (
                  <button
                    key={cat.nombre}
                    type="button"
                    onClick={() => setCategoria(cat.nombre)}
                    className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
                      categoria === cat.nombre
                       ? 'bg-gradient-to-r from-cyan-600 to-purple-600 border-transparent'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <cat.icon size={18} />
                    <span className="text-sm">{cat.nombre}</span>
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={premium}
                  onChange={e => setPremium(e.target.checked)}
                  className="w-5 h-5 accent-cyan-500 rounded"
                />
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Crown size={18} className="text-yellow-400" />
                  Marcar como Premium
                </span>
              </label>

              <label className="flex items-center justify-center gap-3 w-full px-4 py-8 backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-500/50">
                <Upload className="w-5 h-5 text-cyan-400" />
                <span className="text-gray-400">{files.length > 0? `${files.length} imagen(es) seleccionada(s)` : 'Seleccionar imágenes'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => setFiles(Array.from(e.target.files))}
                  className="hidden"
                />
              </label>

              {files.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {files.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 py-4 rounded-xl font-bold"
              >
                {loading? 'Subiendo...' : 'Agregar Producto'}
              </button>
            </form>
          </motion.div>

          {/* Inventario */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10"
          >
            <h2 className="text-2xl font-bold mb-6">Inventario</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {productos.map((producto) => {
                const imagenes = producto.imagenes || [producto.imagen]
                const idxActual = indiceImagen[producto.id] || 0

                return (
                  <div key={producto.id} className="backdrop-blur-xl bg-white/5 rounded-2xl p-4 border-white/10">
                    <div className="relative mb-3">
                      <img
                        src={imagenes[idxActual]}
                        alt={producto.nombre}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      {imagenes.length > 1 && (
                        <>
                          <button
                            onClick={() => cambiarImagen(producto.id, -1, imagenes.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => cambiarImagen(producto.id, 1, imagenes.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold">{producto.nombre}</h3>
                        <p className="text-2xl font-black text-cyan-400">
                          ${Number(producto.precio).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-400">{producto.categoria}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Trash2, Zap, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('Bolsos Dama');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
    if (!file ||!nombre ||!precio) {
      toast.error('Completa todos los campos');
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
      } else {
        toast.error('Error al borrar');
      }
    } catch {
      toast.error('Error al borrar');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,50,255,0.15),transparent_50%)]" />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 20%, rgba(0,255,255,0.1), transparent 40%)',
              'radial-gradient(circle at 80% 80%, rgba(168,85,247,0.1), transparent 40%)',
              'radial-gradient(circle at 20% 80%, rgba(0,255,255,0.1), transparent 40%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      </div>

      {/* Cursor glow */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none z-0"
        animate={{ x: mousePos.x - 192, y: mousePos.y - 192 }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
      >
        <div className="w-full h-full bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Zap className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
          </motion.div>

          <motion.a
            href="/"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168,85,247,0.5)" }}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 font-bold"
          >
            Ver Tienda
          </motion.a>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Formulario Nuevo Producto */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Nuevo Producto
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Nombre del Producto</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    className="w-full mt-2 px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    placeholder="Ej: Bolso Louis Vuitton"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Precio</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    className="w-full mt-2 px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                    placeholder="1500000"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Categoría</label>
                  <select
                    value={categoria}
                    onChange={e => setCategoria(e.target.value)}
                    className="w-full mt-2 px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all cursor-pointer"
                  >
                    <option className="bg-black">Bolsos Dama</option>
                    <option className="bg-black">Bolsos Caballero</option>
                    <option className="bg-black">Ropa Dama</option>
                    <option className="bg-black">Ropa Caballero</option>
                    <option className="bg-black">Accesorios</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Imagen del Producto</label>
                  <label className="mt-2 flex items-center justify-center gap-3 w-full px-4 py-8 backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-all">
                    <Upload className="w-5 h-5 text-cyan-400" />
                    <span className="text-gray-400">{file? file.name : 'Seleccionar imagen'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading? 1 : 1.02 }}
                  whileTap={{ scale: loading? 1 : 0.98 }}
                  className="w-full relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 transition-transform group-hover/btn:scale-110" />
                  <span className="relative flex items-center justify-center gap-2 bg-black/80 py-4 rounded-xl font-bold backdrop-blur-sm group-hover/btn:bg-transparent transition-all">
                    {loading? 'Subiendo...' : 'Agregar Producto'}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Inventario */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Package className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Inventario
                  </h2>
                </div>
                <span className="px-4 py-1 rounded-full bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border-cyan-500/30 text-cyan-400 font-bold text-sm">
                  {productos.length} productos
                </span>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {productos.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No hay productos aún</p>
                  </div>
                )}

                <AnimatePresence mode="popLayout">
                  {productos.map((producto, i) => (
                    <motion.div
                      key={producto.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className="group/item relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      <div className="relative flex gap-4 p-4 backdrop-blur-xl bg-white/5 rounded-2xl border-white/10 hover:border-cyan-500/30 transition-all">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{producto.nombre}</h3>
                          <p className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            ${Number(producto.precio).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-400">{producto.categoria}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(producto.id)}
                          className="self-start p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <style jsx global>{`
       .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
       .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
       .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #a855f7);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
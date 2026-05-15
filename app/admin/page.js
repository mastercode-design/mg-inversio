'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, Zap, Upload, Crown, Shirt, Briefcase, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const categorias = [
  { nombre: 'Bolsos Dama', icon: Briefcase, color: 'from-pink-500 to-rose-500' },
  { nombre: 'Bolsos Caballero', icon: Briefcase, color: 'from-blue-500 to-cyan-500' },
  { nombre: 'Ropa Dama', icon: Shirt, color: 'from-purple-500 to-fuchsia-500' },
  { nombre: 'Ropa Caballero', icon: Shirt, color: 'from-indigo-500 to-blue-500' },
  { nombre: 'Accesorios', icon: Package, color: 'from-amber-500 to-orange-500' }
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchProductos();
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos', { cache: 'no-store' });
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
      } else {
        const error = await res.json();
        toast.error(error.error || 'Error al borrar');
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

  const getCategoriaData = (nombreCat) => {
    return categorias.find(c => c.nombre === nombreCat) || categorias[0];
  }

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
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Cursor glow */}
      <motion.div
        className="fixed w-96 h-96 pointer-events-none z-0 hidden md:block"
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
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-8 h-8 text-cyan-400" />
            </motion.div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ADMIN PANEL
            </h1>
          </div>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-600 to-purple-600 font-bold shadow-lg shadow-purple-500/30"
          >
            Ver Tienda
          </motion.a>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-3xl" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-cyan-400" size={24} />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Nuevo Producto
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Nombre</label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Producto premium..."
                    className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Precio</label>
                  <input
                    type="number"
                    value={precio}
                    onChange={e => setPrecio(e.target.value)}
                    placeholder="150000"
                    className="w-full px-4 py-3 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-2 block uppercase tracking-wider">Categoría</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categorias.map(cat => (
                      <motion.button
                        key={cat.nombre}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setCategoria(cat.nombre)}
                        className={`px-4 py-3 rounded-xl border flex items-center gap-2 transition-all ${
                          categoria === cat.nombre
                         ? `bg-gradient-to-r ${cat.color} border-transparent shadow-lg`
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <cat.icon size={18} />
                        <span className="text-sm font-medium">{cat.nombre.split(' ')[0]}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={premium}
                      onChange={e => setPremium(e.target.checked)}
                      className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                    />
                  </div>
                  <span className="text-sm font-semibold flex items-center gap-2 group-hover:text-yellow-400 transition">
                    <Crown size={18} className="text-yellow-400" />
                    Marcar como Premium
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center gap-3 w-full px-4 py-8 backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-cyan-500/50 transition-all group">
                  <Upload className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition" />
                  <span className="text-gray-400 text-sm">{files.length > 0? `${files.length} imagen(es) seleccionada(s)` : 'Arrastra o selecciona imágenes'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files))}
                    className="hidden"
                  />
                </label>

                {files.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                    {files.map((file, idx) => (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border-2 border-cyan-500/30"
                      />
                    ))}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 py-4 rounded-xl font-bold disabled:opacity-50 shadow-lg shadow-purple-500/30 relative overflow-hidden group"
                >
                  <span className="relative z-10">{loading? 'Subiendo...' : 'Agregar Producto'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Inventario */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 relative backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-purple-400" size={24} />
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Inventario
                  </h2>
                </div>
                <span className="text-sm text-gray-400">{productos.length} productos</span>
              </div>

              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <AnimatePresence mode="popLayout">
                  {productos.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20"
                    >
                      <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500">No hay productos aún</p>
                    </motion.div>
                  )}

                  {productos.map((producto, i) => {
                    const imagenes = producto.imagenes || [producto.imagen]
                    const idxActual = indiceImagen[producto.id] || 0
                    const catData = getCategoriaData(producto.categoria)

                    return (
                      <motion.div
                        key={producto.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="group relative"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${catData.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />

                        <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-4 border-white/10 group-hover:border-white/20 transition-all">
                          <div className="flex gap-4">
                            {/* Imagen */}
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                              <img
                                src={imagenes[idxActual]}
                                alt={producto.nombre}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              {imagenes.length > 1 && (
                                <>
                                  <button
                                    onClick={() => cambiarImagen(producto.id, -1, imagenes.length)}
                                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <ChevronLeft size={16} />
                                  </button>
                                  <button
                                    onClick={() => cambiarImagen(producto.id, 1, imagenes.length)}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <ChevronRight size={16} />
                                  </button>
                                </>
                              )}
                              {producto.premium && (
                                <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-amber-500 px-2 py-1 rounded-full">
                                  <Crown size={12} fill="currentColor" />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex-col justify-between">
                              <div>
                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${catData.color} mb-2`}>
                                  {producto.categoria}
                                </div>
                                <h3 className="font-bold text-lg mb-1 line-clamp-1">{producto.nombre}</h3>
                                <p className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                                  ${Number(producto.precio).toLocaleString()}
                                </p>
                              </div>

                              <div className="flex justify-end">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(producto.id)}
                                  className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
                                >
                                  <Trash2 size={18} />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
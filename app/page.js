'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, SlidersHorizontal, Star, X, Sparkles, TrendingUp, Crown, ShoppingBag, Filter, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

const WPP1 = '3151101628'
const WPP2 = '3174811805'
const IG = 'MG.inversion'

export default function Tienda() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [filtroCat, setFiltroCat] = useState('Todos')
  const [ordenPrecio, setOrdenPrecio] = useState('')
  const [soloPremium, setSoloPremium] = useState(false)
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [cargando, setCargando] = useState(true)

useEffect(() => {
  fetch('/api/productos', { cache: 'no-store' }) // ← AGREGA ESTO
    .then(r => r.json())
    .then(data => {
      setProductos(data);
      setCargando(false);
    })
    .catch(() => {
      toast.error("Error cargando productos");
      setCargando(false);
    });
}, []);

  const categorias = [
    { nombre: 'Todos', icon: Sparkles },
    { nombre: 'Bolsos Dama', icon: ShoppingBag },
    { nombre: 'Bolsos Caballero', icon: ShoppingBag },
    { nombre: 'Ropa Dama', icon: Crown },
    { nombre: 'Ropa Caballero', icon: Crown }
  ]

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]
    if (busqueda) {
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    if (filtroCat !== 'Todos') {
      resultado = resultado.filter(p => p.categoria === filtroCat)
    }
    if (soloPremium) {
      resultado = resultado.filter(p => p.premium === true)
    }
    if (ordenPrecio === 'barato') {
      resultado.sort((a, b) => Number(a.precio) - Number(b.precio))
    } else if (ordenPrecio === 'caro') {
      resultado.sort((a, b) => Number(b.precio) - Number(a.precio))
    }
    return resultado
  }, [productos, busqueda, filtroCat, ordenPrecio, soloPremium])

  const comprarWpp = (prod) => {
    const msg = `Hola MG INVERSION! 👋 Quiero comprar:\n\n*${prod.nombre}*\n💰 Precio: $${Number(prod.precio).toLocaleString()}\n🏷️ Categoría: ${prod.categoria}\n\n¿Está disponible?`
    window.open(`https://wa.me/57${WPP1}?text=${encodeURIComponent(msg)}`, '_blank')
    toast.success('Abriendo WhatsApp...')
  }

  const limpiarFiltros = () => {
    setBusqueda('')
    setFiltroCat('Todos')
    setOrdenPrecio('')
    setSoloPremium(false)
    toast.success('Filtros limpiados')
  }

  const filtrosActivos = busqueda || filtroCat !== 'Todos' || ordenPrecio || soloPremium

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-yellow-400">
      {/* HEADER ANIMADO */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-50 border-b border-yellow-600/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl md:text-5xl font-black gold-gradient">
                MG INVERSION
              </h1>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-2"
            >
              <motion.a 
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href={`https://wa.me/57${WPP1}`} 
                target="_blank" 
                className="glass p-3 rounded-xl hover:bg-green-500/10 transition"
              >
                <MessageCircle className="text-green-500 w-6 h-6" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                href={`https://instagram.com/${IG}`} 
                target="_blank" 
                className="glass p-3 rounded-xl hover:bg-pink-500/10 transition"
              >
                <svg className="text-pink-500 w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.979 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            </motion.div>
          </div>

          {/* BUSCADOR PRO */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-600 w-5 h-5 group-focus-within:text-yellow-400 transition" />
              <input
                type="text"
                placeholder="Buscar bolsos, ropa premium..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="btn-gold px-6 flex items-center gap-2 relative"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filtros</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${mostrarFiltros ? 'rotate-180' : ''}`} />
              {filtrosActivos && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full pulse-gold"></span>}
            </motion.button>
          </motion.div>
        </div>

        {/* FILTROS ANIMADOS */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-yellow-600/20 bg-black/50 backdrop-blur-xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold mb-3 text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                      <Filter size={14} /> CATEGORÍA
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categorias.map(cat => (
                        <motion.button
                          key={cat.nombre}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFiltroCat(cat.nombre)}
                          className={`px-4 py-2 rounded-xl text-sm border-2 transition-all flex items-center gap-2 ${
                            filtroCat === cat.nombre 
                              ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-500/30' 
                              : 'glass border-yellow-600/30 hover:border-yellow-500'
                          }`}
                        >
                          <cat.icon size={16} />
                          {cat.nombre}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-3 text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={14} /> PRECIO
                    </p>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOrdenPrecio(ordenPrecio === 'barato' ? '' : 'barato')}
                        className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                          ordenPrecio === 'barato' 
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-500/30' 
                            : 'glass border-yellow-600/30 hover:border-yellow-500'
                        }`}
                      >
                        Menor
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOrdenPrecio(ordenPrecio === 'caro' ? '' : 'caro')}
                        className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                          ordenPrecio === 'caro' 
                            ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-500/30' 
                            : 'glass border-yellow-600/30 hover:border-yellow-500'
                        }`}
                      >
                        Mayor
                      </motion.button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-3 text-yellow-500 uppercase tracking-wider flex items-center gap-2">
                      <Crown size={14} /> COLECCIÓN
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSoloPremium(!soloPremium)}
                      className={`w-full px-4 py-2 rounded-xl border-2 flex items-center justify-center gap-2 transition-all ${
                        soloPremium 
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500 shadow-lg shadow-yellow-500/30' 
                          : 'glass border-yellow-600/30 hover:border-yellow-500'
                      }`}
                    >
                      <Star size={18} fill={soloPremium ? 'black' : 'none'} />
                      Solo Premium
                    </motion.button>
                  </div>
                </div>

                {filtrosActivos && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={limpiarFiltros}
                    className="mt-4 text-sm text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                  >
                    <X size={16} /> Limpiar todos los filtros
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO ANIMADO */}
      <section className="py-20 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-30"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 text-yellow-500 mx-auto" />
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black gold-gradient mb-6">
            Elegancia en Cada Detalle
          </h2>
          <p className="text-yellow-600/80 text-xl md:text-2xl font-light">
            Bolsos y Ropa Premium para Dama y Caballero
          </p>
        </motion.div>
      </section>

      {/* CONTADOR */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl px-6 py-3 inline-flex items-center gap-3"
        >
          <TrendingUp className="w-5 h-5 text-yellow-500" />
          <p className="text-yellow-400 font-semibold">
            {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto exclusivo' : 'productos exclusivos'}
          </p>
        </motion.div>
      </div>

      {/* PRODUCTOS */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
        <AnimatePresence mode="popLayout">
          {cargando ? (
            [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl h-96 shimmer"
              />
            ))
          ) : (
            productosFiltrados.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl overflow-hidden card-hover group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={p.imagen} 
                    alt={p.nombre} 
                    className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {p.premium && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                      className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-2 rounded-full text-xs font-black flex items-center gap-1 shadow-lg"
                    >
                      <Crown size={14} fill="black" /> PREMIUM
                    </motion.div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs text-yellow-600/60 mb-2 uppercase tracking-wider">{p.categoria}</p>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition-colors line-clamp-2">
                    {p.nombre}
                  </h3>
                  <p className="text-4xl font-black gold-gradient mb-5">
                    ${Number(p.precio).toLocaleString()}
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => comprarWpp(p)} 
                    className="btn-gold w-full flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Comprar Ahora
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {productosFiltrados.length === 0 && !cargando && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <Sparkles className="w-16 h-16 text-yellow-600/30 mx-auto mb-4" />
          <p className="text-yellow-600 text-2xl mb-6">No se encontraron productos</p>
          <button onClick={limpiarFiltros} className="btn-gold">Ver todos los productos</button>
        </motion.div>
      )}

      {/* FOOTER PRO */}
      <footer className="glass border-t border-yellow-600/20 py-12 text-center mt-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="mb-6 text-yellow-500 font-black text-xl tracking-wider">CONTÁCTANOS</p>
          <div className="flex gap-8 justify-center flex-wrap mb-8">
            <motion.a 
              whileHover={{ scale: 1.1, y: -2 }}
              href={`https://wa.me/57${WPP1}`} 
              className="flex items-center gap-2 hover:text-green-400 transition text-yellow-400"
            >
              <MessageCircle size={20} /> 315 110 1628
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, y: -2 }}
              href={`https://wa.me/57${WPP2}`} 
              className="flex items-center gap-2 hover:text-green-400 transition text-yellow-400"
            >
              <MessageCircle size={20} /> 317 481 1805
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.1, y: -2 }}
              href={`https://instagram.com/${IG}`} 
              className="flex items-center gap-2 hover:text-pink-400 transition text-yellow-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.979 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @{IG}
            </motion.a>
          </div>
          <p className="text-yellow-700/50 text-sm">© 2026 MG INVERSION - Todos los derechos reservados</p>
        </motion.div>
      </footer>
    </div>
  )
}
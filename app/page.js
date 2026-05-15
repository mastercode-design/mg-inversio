'use client'
import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Search, SlidersHorizontal, Star, X, Sparkles, Crown, ShoppingBag, Filter, Zap, ChevronLeft, ChevronRight, ZoomIn, Package } from 'lucide-react'
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showGreeting, setShowGreeting] = useState(true)
  const [modalImagen, setModalImagen] = useState(null)
  const [productoModal, setProductoModal] = useState(null)
  const [indiceImagen, setIndiceImagen] = useState({})

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 60000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    fetch('/api/productos', { cache: 'no-store' })
   .then(r => r.json())
   .then(data => {
        setProductos(data)
        setCargando(false)
      })
   .catch(() => {
        toast.error("Error cargando productos")
        setCargando(false)
      })
  }, [])

  const categorias = [
    { nombre: 'Todos', icon: Sparkles },
    { nombre: 'Bolsos Dama', icon: ShoppingBag },
    { nombre: 'Bolsos Caballero', icon: ShoppingBag },
    { nombre: 'Ropa Dama', icon: Crown },
    { nombre: 'Ropa Caballero', icon: Crown },
    { nombre: 'Accesorios', icon: Package }
  ]

  const productosFiltrados = useMemo(() => {
    let resultado = [...productos]
    if (busqueda) {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busqueda.toLowerCase())
      )
    }
    if (filtroCat!== 'Todos') {
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

  const cambiarImagen = (prodId, dir, total) => {
    setIndiceImagen(prev => {
      const actual = prev[prodId] || 0
      let nuevo = actual + dir
      if (nuevo < 0) nuevo = total - 1
      if (nuevo >= total) nuevo = 0
      return {...prev, [prodId]: nuevo }
    })
  }

  const abrirModal = (prod, idx) => {
    const imagenes = prod.imagenes && prod.imagenes.length > 0? prod.imagenes : [prod.imagen]
    setProductoModal({...prod, imagenes })
    setModalImagen(imagenes[idx])
    setIndiceImagen(prev => ({...prev, [prod.id]: idx }))
  }

  const cambiarModalImagen = (dir) => {
    if (!productoModal) return
    const imagenes = productoModal.imagenes
    const actual = indiceImagen[productoModal.id] || 0
    let nuevo = actual + dir
    if (nuevo < 0) nuevo = imagenes.length - 1
    if (nuevo >= imagenes.length) nuevo = 0
    setIndiceImagen(prev => ({...prev, [productoModal.id]: nuevo }))
    setModalImagen(imagenes[nuevo])
  }

  const filtrosActivos = busqueda || filtroCat!== 'Todos' || ordenPrecio || soloPremium

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Modal imagen grande */}
      <AnimatePresence>
        {modalImagen && productoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setModalImagen(null); setProductoModal(null) }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={modalImagen}
              alt="Producto"
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Flechas en modal */}
            {productoModal.imagenes.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); cambiarModalImagen(-1) }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-cyan-400/50"
                >
                  <ChevronLeft size={28} className="text-cyan-400" />
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); cambiarModalImagen(1) }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl p-3 rounded-full border-purple-400/50"
                >
                  <ChevronRight size={28} className="text-purple-400" />
                </button>
              </>
            )}

            <button
              onClick={() => { setModalImagen(null); setProductoModal(null) }}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl p-3 rounded-full hover:bg-white/20 transition"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saludo animado */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGreeting(false)}
          >
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative backdrop-blur-2xl bg-white/5 border-white/10 rounded-3xl p-8 max-w-sm mx-4"
            >
              <button
                onClick={() => setShowGreeting(false)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 hover:bg-red-600 transition z-10"
              >
                <X size={18} />
              </button>

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-60" />
                  <img
                    src="/foto-saludo.png"
                    alt="MG INVERSION"
                    className="relative w-40 h-40 object-cover rounded-full border-2 border-cyan-400/50"
                  />
                </div>
              </motion.div>

              <div className="text-center">
                <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Hola, somos M y G
                </h3>
                <p className="text-gray-300 mb-2">Bienvenido a nuestra tienda</p>
                <p className="text-lg font-semibold text-cyan-400">y al futuro de la elegancia ✨</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowGreeting(false)}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold w-full"
                >
                  Ver Productos
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* HEADER */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-2xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MG INVERSION
              </h1>
            </div>

            <div className="flex gap-2">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={`https://wa.me/57${WPP1}`}
                target="_blank"
                className="backdrop-blur-xl bg-white/5 p-3 rounded-xl border-white/10 hover:border-cyan-500/50 transition-all"
              >
                <MessageCircle className="text-cyan-400 w-6 h-6" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href={`https://instagram.com/${IG}`}
                target="_blank"
                className="backdrop-blur-xl bg-white/5 p-3 rounded-xl border-white/10 hover:border-purple-500/50 transition-all"
              >
                <svg className="text-purple-400 w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.979 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </motion.a>
            </div>
          </div>

          {/* BUSCADOR */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-4 backdrop-blur-xl bg-white/5 border-white/10 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="relative backdrop-blur-xl bg-gradient-to-r from-purple-600 to-cyan-600 px-6 py-4 rounded-xl font-bold flex items-center gap-2"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden md:inline">Filtros</span>
              {filtrosActivos && <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>}
            </motion.button>
          </div>
        </div>

        {/* FILTROS */}
        <AnimatePresence>
          {mostrarFiltros && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/10 bg-black/50 backdrop-blur-2xl"
            >
              <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs font-bold mb-3 text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                      <Filter size={14} /> CATEGORÍA
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categorias.map(cat => (
                        <motion.button
                          key={cat.nombre}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setFiltroCat(cat.nombre)}
                          className={`px-4 py-2 rounded-xl text-sm border transition-all flex items-center gap-2 ${
                            filtroCat === cat.nombre
                           ? 'bg-gradient-to-r from-cyan-600 to-purple-600 border-transparent shadow-lg shadow-cyan-500/30'
                            : 'backdrop-blur-xl bg-white/5 border-white/10 hover:border-cyan-500/50'
                          }`}
                        >
                          <cat.icon size={16} />
                          {cat.nombre}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-3 text-cyan-400 uppercase tracking-wider">PRECIO</p>
                    <div className="flex gap-2">
                      {['barato', 'caro'].map(orden => (
                        <motion.button
                          key={orden}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setOrdenPrecio(ordenPrecio === orden? '' : orden)}
                          className={`flex-1 px-4 py-2 rounded-xl border transition-all ${
                            ordenPrecio === orden
                           ? 'bg-gradient-to-r from-cyan-600 to-purple-600 border-transparent'
                            : 'backdrop-blur-xl bg-white/5 border-white/10'
                          }`}
                        >
                          {orden === 'barato'? 'Menor' : 'Mayor'}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold mb-3 text-cyan-400 uppercase tracking-wider">COLECCIÓN</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSoloPremium(!soloPremium)}
                      className={`w-full px-4 py-2 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                        soloPremium
                       ? 'bg-gradient-to-r from-cyan-600 to-purple-600 border-transparent'
                        : 'backdrop-blur-xl bg-white/5 border-white/10'
                      }`}
                    >
                      <Star size={18} fill={soloPremium? 'currentColor' : 'none'} />
                      Solo Premium
                    </motion.button>
                  </div>
                </div>

                {filtrosActivos && (
                  <motion.button
                    onClick={limpiarFiltros}
                    className="mt-4 text-sm text-pink-400 hover:text-pink-300 flex items-center gap-1 transition"
                  >
                    <X size={16} /> Limpiar filtros
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* HERO */}
      <section className="py-24 text-center px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 text-cyan-400 mx-auto" />
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Futuro en Tus Manos
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Bolsos, Ropa y Accesorios Premium
          </p>
        </motion.div>
      </section>

      {/* PRODUCTOS */}
      <div className="max-w-7xl mx-auto px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-10">
        <AnimatePresence mode="popLayout">
          {cargando? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="backdrop-blur-xl bg-white/5 rounded-2xl h-96 border-white/10 animate-pulse" />
            ))
          ) : (
            productosFiltrados.map((p, i) => {
              const imagenes = p.imagenes && p.imagenes.length > 0? p.imagenes : [p.imagen]
              const idxActual = indiceImagen[p.id] || 0

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" />

                  <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl overflow-hidden border-white/10 group-hover:border-cyan-500/50 transition-all">

                    {/* Imagen con galería */}
                    <div className="relative overflow-hidden h-72">
                      <img
                        src={imagenes[idxActual]}
                        alt={p.nombre}
                        className="w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110"
                        onClick={() => abrirModal(p, idxActual)}
                      />

                      <button
                        onClick={() => abrirModal(p, idxActual)}
                        className="absolute top-3 right-3 bg-black/50 backdrop-blur-xl p-2 rounded-full opacity-0 group-hover:opacity-100 transition z-10"
                      >
                        <ZoomIn size={18} />
                      </button>

                      {/* Flechas - Siempre visibles en móvil */}
                      {imagenes.length > 1 && (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              cambiarImagen(p.id, -1, imagenes.length)
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-80" />
                            <div className="relative bg-black/70 backdrop-blur-xl p-3 rounded-full border-cyan-400/50">
                              <ChevronLeft size={22} className="text-cyan-400" />
                            </div>
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation()
                              cambiarImagen(p.id, 1, imagenes.length)
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-md opacity-80" />
                            <div className="relative bg-black/70 backdrop-blur-xl p-3 rounded-full border-purple-400/50">
                              <ChevronRight size={22} className="text-purple-400" />
                            </div>
                          </motion.button>

                          {/* Indicadores */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {imagenes.map((_, idx) => (
                              <motion.div
                                key={idx}
                                animate={{
                                  width: idx === idxActual? 24 : 8,
                                  backgroundColor: idx === idxActual? '#06b6d4' : 'rgba(255,255,255,0.4)'
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-2 rounded-full"
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {p.premium && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 rounded-full text-xs font-black flex items-center gap-1">
                          <Crown size={14} fill="currentColor" /> PREMIUM
                        </div>
                      )}
                    </div>

                    {/* Info del producto */}
                    <div className="p-6">
                      <p className="text-xs text-cyan-400/60 mb-2 uppercase tracking-wider">{p.categoria}</p>
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{p.nombre}</h3>
                      <p className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-5">
                        ${Number(p.precio).toLocaleString()}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => comprarWpp(p)}
                        className="w-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600" />
                        <span className="relative flex items-center justify-center gap-2 bg-black/80 py-3 rounded-xl font-bold backdrop-blur-sm hover:bg-transparent transition-all">
                          <MessageCircle size={20} />
                          Comprar Ahora
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {productosFiltrados.length === 0 &&!cargando && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 relative z-10"
        >
          <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-2xl mb-6">No se encontraron productos</p>
          <button onClick={limpiarFiltros} className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold">
            Ver todos los productos
          </button>
        </motion.div>
      )}

      {/* FOOTER */}
      <footer className="backdrop-blur-2xl bg-white/5 border-t border-white/10 py-12 mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="grid md:grid-cols-3 gap-8 mb-8 text-center md:text-left">
            <div>
              <p className="mb-4 text-cyan-400 font-black text-lg tracking-wider">CONTÁCTANOS</p>
              <div className="space-y-3">
                <a href={`https://wa.me/57${WPP1}`} target="_blank" className="flex items-center justify-center md:justify-start gap-2 hover:text-cyan-400 transition text-gray-400">
                  <MessageCircle size={20} /> 315 110 1628
                </a>
                <a href={`https://wa.me/57${WPP2}`} target="_blank" className="flex items-center justify-center md:justify-start gap-2 hover:text-cyan-400 transition text-gray-400">
                  <MessageCircle size={20} /> 317 481 1805
                </a>
              </div>
            </div>

            <div>
              <p className="mb-4 text-purple-400 font-black text-lg tracking-wider">SÍGUENOS</p>
              <a href={`https://instagram.com/${IG}`} target="_blank" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 hover:border-purple-500/60 transition-all">
                <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.979 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="text-white font-semibold">@{IG}</span>
              </a>
            </div>

            <div>
              <p className="mb-4 text-pink-400 font-black text-lg tracking-wider">UBICACIÓN</p>
              <div className="text-gray-400 space-y-1">
                <p className="font-semibold text-white">Cali, Colombia</p>
                <p>Barrio La Rivera</p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-gray-600 text-sm">©️ 2026 MG INVERSION - Todos los derechos reservados</p>
          </div>
        </motion.div>
      </footer>
    </div>
  )
}
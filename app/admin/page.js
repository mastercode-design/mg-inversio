'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, LogOut, Upload, Trash2, Edit, Crown, Package, TrendingUp, DollarSign, Image as ImageIcon, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Admin() {
  const [log, setLog] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const [cargando, setCargando] = useState(false)
  
  const [form, setForm] = useState({
    nombre: '',
    precio: '',
    categoria: 'Bolsos Dama',
    imagen: '',
    premium: false
  })

  const categorias = ['Bolsos Dama', 'Bolsos Caballero', 'Ropa Dama', 'Ropa Caballero']

  useEffect(() => {
    if (localStorage.getItem('admin') === 'true') {
      setLog(true)
      cargarProductos()
    }
  }, [])

  const cargarProductos = () => {
    fetch('/api/productos')
      .then(r => r.json())
      .then(setProductos)
      .catch(() => toast.error('Error cargando productos'))
  }

  const login = () => {
    if (user === 'admin' && pass === 'mg2026') {
      localStorage.setItem('admin', 'true')
      setLog(true)
      cargarProductos()
      toast.success('¡Bienvenido al panel!')
    } else {
      toast.error('Credenciales incorrectas')
    }
  }

  const logout = () => {
    localStorage.removeItem('admin')
    setLog(false)
    setUser('')
    setPass('')
    toast.success('Sesión cerrada')
  }

  const guardar = async () => {
    if (!form.nombre || !form.precio || !form.imagen) {
      toast.error('Completa todos los campos')
      return
    }
    
    setCargando(true)
    const url = editando ? `/api/productos?id=${editando}` : '/api/productos'
    const method = editando ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, precio: Number(form.precio) })
      })
      
      if (res.ok) {
        toast.success(editando ? 'Producto actualizado' : 'Producto agregado')
        setForm({ nombre: '', precio: '', categoria: 'Bolsos Dama', imagen: '', premium: false })
        setEditando(null)
        cargarProductos()
      } else {
        toast.error('Error al guardar')
      }
    } catch {
      toast.error('Error de conexión')
    }
    setCargando(false)
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    
    try {
      const res = await fetch(`/api/productos?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Producto eliminado')
        cargarProductos()
      }
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const editar = (p) => {
    setForm(p)
    setEditando(p.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast('Editando producto', { icon: '✏️' })
  }

  const cancelarEdicion = () => {
    setForm({ nombre: '', precio: '', categoria: 'Bolsos Dama', imagen: '', premium: false })
    setEditando(null)
  }

  const stats = {
    total: productos.length,
    premium: productos.filter(p => p.premium).length,
    valor: productos.reduce((sum, p) => sum + Number(p.precio), 0)
  }

  if (!log) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 w-full max-w-md border border-yellow-600/20"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="flex justify-center mb-6"
          >
            <Crown className="w-16 h-16 text-yellow-500" />
          </motion.div>
          
          <h1 className="text-4xl font-black gold-gradient text-center mb-2">MG INVERSION</h1>
          <p className="text-yellow-600/60 text-center mb-8">Panel de Administración</p>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block">Usuario</label>
              <input
                type="text"
                placeholder="admin"
                value={user}
                onChange={e => setUser(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={login}
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Ingresar al Panel
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-yellow-400 p-6">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="glass rounded-2xl p-6 border border-yellow-600/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Crown className="w-10 h-10 text-yellow-500" />
              <div>
                <h1 className="text-3xl font-black gold-gradient">Panel MG INVERSION</h1>
                <p className="text-yellow-600/60 text-sm">Gestión de Productos Premium</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="glass px-6 py-3 rounded-xl hover:bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-2 transition"
            >
              <LogOut size={18} />
              Salir
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border border-yellow-600/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600/60 text-sm uppercase tracking-wider mb-1">Total Productos</p>
              <p className="text-4xl font-black gold-gradient">{stats.total}</p>
            </div>
            <Package className="w-12 h-12 text-yellow-500/30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border border-yellow-600/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600/60 text-sm uppercase tracking-wider mb-1">Premium</p>
              <p className="text-4xl font-black gold-gradient">{stats.premium}</p>
            </div>
            <Crown className="w-12 h-12 text-yellow-500/30" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 border border-yellow-600/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600/60 text-sm uppercase tracking-wider mb-1">Valor Total</p>
              <p className="text-3xl font-black gold-gradient">${stats.valor.toLocaleString()}</p>
            </div>
            <DollarSign className="w-12 h-12 text-yellow-500/30" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-yellow-600/20 h-fit"
        >
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold gold-gradient">
              {editando ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <Package size={14} /> Nombre del Producto
              </label>
              <input
                type="text"
                placeholder="Ej: Bolso Gucci Premium"
                value={form.nombre}
                onChange={e => setForm({...form, nombre: e.target.value})}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <DollarSign size={14} /> Precio
              </label>
              <input
                type="number"
                placeholder="250000"
                value={form.precio}
                onChange={e => setForm({...form, precio: e.target.value})}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <TrendingUp size={14} /> Categoría
              </label>
              <select
                value={form.categoria}
                onChange={e => setForm({...form, categoria: e.target.value})}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-yellow-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <ImageIcon size={14} /> URL de Imagen
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={form.imagen}
                onChange={e => setForm({...form, imagen: e.target.value})}
                className="w-full px-4 py-3 glass rounded-xl text-yellow-400 placeholder-yellow-700/50 focus:ring-2 focus:ring-yellow-500/50 focus:outline-none transition"
              />
              {form.imagen && (
                <motion.img 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={form.imagen} 
                  alt="Preview" 
                  className="mt-3 w-full h-40 object-cover rounded-xl border border-yellow-600/30"
                />
              )}
            </div>

            <label className="flex items-center gap-3 glass p-4 rounded-xl cursor-pointer hover:bg-yellow-500/5 transition">
              <input
                type="checkbox"
                checked={form.premium}
                onChange={e => setForm({...form, premium: e.target.checked})}
                className="w-5 h-5 accent-yellow-500"
              />
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="font-semibold">Producto Premium</span>
            </label>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={guardar}
                disabled={cargando}
                className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Save size={20} />
                {cargando ? 'Guardando...' : editando ? 'Actualizar' : 'Agregar'}
              </motion.button>
              
              {editando && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelarEdicion}
                  className="glass px-6 py-3 rounded-xl hover:bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-2 transition"
                >
                  <X size={20} />
                  Cancelar
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-8 border border-yellow-600/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold gold-gradient">
              Inventario ({productos.length})
            </h2>
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            <AnimatePresence mode="popLayout">
              {productos.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <AlertCircle className="w-12 h-12 text-yellow-600/30 mx-auto mb-3" />
                  <p className="text-yellow-600/60">No hay productos aún</p>
                </motion.div>
              ) : (
                productos.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-xl p-4 border border-yellow-600/10 hover:border-yellow-500/30 transition-all group"
                  >
                    <div className="flex gap-4">
                      <img 
                        src={p.imagen} 
                        alt={p.nombre} 
                        className="w-20 h-20 object-cover rounded-lg border border-yellow-600/20"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-yellow-300 truncate">{p.nombre}</h3>
                          {p.premium && <Crown size={16} className="text-yellow-500 flex-shrink-0" fill="currentColor" />}
                        </div>
                        <p className="text-xs text-yellow-600/60 mb-2">{p.categoria}</p>
                        <p className="text-2xl font-black gold-gradient">${Number(p.precio).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => editar(p)}
                          className="p-2 glass rounded-lg hover:bg-yellow-500/10 text-yellow-500 transition"
                        >
                          <Edit size={18} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => eliminar(p.id)}
                          className="p-2 glass rounded-lg hover:bg-red-500/10 text-red-400 transition"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
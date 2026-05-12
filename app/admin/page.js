'use client'
import { useState, useEffect } from 'react'

export default function Admin() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'Bolsos Dama',
    premium: false,
    img: ''
  })

  // Cargar productos al entrar
  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const res = await fetch('/api/productos')
    const data = await res.json()
    setProductos(data)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = form.img

      // Si hay archivo, súbelo a Vercel Blob
      if (imageFile) {
        const response = await fetch(`/api/upload?filename=${imageFile.name}`, {
          method: 'POST',
          body: imageFile,
        });

        if (!response.ok) throw new Error('Error subiendo imagen')

        const blob = await response.json();
        imageUrl = blob.url
      }

      // Guardar producto
      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
         ...form,
          price: Number(form.price),
          img: imageUrl
        })
      })

      if (!res.ok) throw new Error('Error guardando producto')

      // Limpiar form
      setForm({ name: '', price: '', category: 'Bolsos Dama', premium: false, img: '' })
      setImageFile(null)
      setImagePreview('')
      fetchProductos()
      alert('Producto agregado ✅')

    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('¿Borrar este producto?')) return
    await fetch(`/api/productos/${id}`, { method: 'DELETE' })
    fetchProductos()
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* FORM AGREGAR */}
        <div>
          <h1 className="text-3xl font-bold text-yellow-400 mb-6">📦 Nuevo Producto</h1>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-yellow-400/80 mb-2">NOMBRE DEL PRODUCTO</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full p-3 bg-black/40 border border-yellow-500/30 rounded-lg focus:border-yellow-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-yellow-400/80 mb-2">$ PRECIO</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({...form, price: e.target.value})}
                className="w-full p-3 bg-black/40 border border-yellow-500/30 rounded-lg focus:border-yellow-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-yellow-400/80 mb-2">CATEGORÍA</label>
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="w-full p-3 bg-black/40 border border-yellow-500/30 rounded-lg focus:border-yellow-400 outline-none"
              >
                <option>Bolsos Dama</option>
                <option>Relojes</option>
                <option>Joyas</option>
                <option>Accesorios</option>
              </select>
            </div>

            <div>
              <label className="block text-yellow-400/80 mb-2">📸 IMAGEN DEL PRODUCTO</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-3 bg-black/40 border border-yellow-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-500 file:text-black file:font-bold hover:file:bg-yellow-400 cursor-pointer"
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="mt-3 h-40 rounded-lg object-cover border border-yellow-500/30" />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.premium}
                onChange={e => setForm({...form, premium: e.target.checked})}
                className="w-5 h-5 accent-yellow-500"
              />
              <label>👑 Producto Premium</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading? 'Subiendo...' : '📁 Agregar Producto'}
            </button>
          </form>
        </div>

        {/* INVENTARIO */}
        <div>
          <h2 className="text-3xl font-bold text-yellow-400 mb-6">📦 Inventario ({productos.length})</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {productos.length === 0 && <p className="text-white/50">No hay productos</p>}
            {productos.map(p => (
              <div key={p.id} className="flex gap-4 bg-black/40 border border-yellow-500/20 p-3 rounded-lg">
                <img src={p.img} alt={p.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-yellow-400">${p.price}</p>
                  <p className="text-sm text-white/60">{p.category}</p>
                </div>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"
                >
                  Borrar
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
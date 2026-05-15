import { kv } from '@vercel/kv'
import { revalidatePath } from 'next/cache'

export async function DELETE(request, { params }) {
  const { id } = await params

  try {
    const producto = await kv.get(`producto:${id}`)

    if (!producto) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    await kv.del(`producto:${id}`)

    // Invalida cache para que desaparezca al instante
    revalidatePath('/api/productos')
    revalidatePath('/')

    return Response.json({ ok: true })
  } catch (error) {
    console.error('DELETE ERROR:', error)
    return Response.json({ error: 'Error eliminando producto' }, { status: 500 })
  }
}

export async function GET(request, { params }) {
  const { id } = await params

  try {
    const producto = await kv.get(`producto:${id}`)
    if (!producto) {
      return Response.json({ error: 'Producto no encontrado' }, { status: 404 })
    }
    return Response.json(producto)
  } catch (error) {
    return Response.json({ error: 'Error obteniendo producto' }, { status: 500 })
  }
}
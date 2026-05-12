import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const keys = await kv.keys('producto:*')
    
    if (!keys || keys.length === 0) {
      return NextResponse.json([])
    }

    const productos = await kv.mget(...keys)
    const productosValidos = productos.filter(Boolean)
    productosValidos.sort((a, b) => b.id.localeCompare(a.id))

    return NextResponse.json(productosValidos, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    })
  } catch (error) {
    console.error('GET ERROR:', error)
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const id = Date.now().toString()

    const producto = {
      id,
      nombre: body.nombre,
      precio: Number(body.precio),
      categoria: body.categoria,
      imagen: body.imagen,
      creado: new Date().toISOString()
    }

    await kv.set(`producto:${id}`, producto)
    return NextResponse.json(producto)
  } catch (error) {
    console.error('POST ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
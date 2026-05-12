import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const dynamic = 'force-dynamic'

export async function GET() {
  const productos = await kv.get('productos')
  return NextResponse.json(productos || [])
}

export async function POST(request) {
  const body = await request.json()
  const productos = await kv.get('productos') || []
  const nuevo = { 
    id: Date.now().toString(), 
    ...body, 
    precio: Number(body.precio),
    premium: Boolean(body.premium)
  }
  productos.push(nuevo)
  await kv.set('productos', productos)
  return NextResponse.json(nuevo)
}

export async function DELETE(request) {
  const { id } = await request.json()
  const productos = await kv.get('productos') || []
  const filtrados = productos.filter(p => p.id !== id)
  await kv.set('productos', filtrados)
  return NextResponse.json({ ok: true })
}
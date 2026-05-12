import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { del } from '@vercel/blob'

export const dynamic = 'force-dynamic'

export async function DELETE(request, { params }) {
  const { id } = params

  try {
    const producto = await kv.get(`producto:${id}`)
    if (producto?.imagen) {
      await del(producto.imagen).catch(() => {})
    }
    await kv.del(`producto:${id}`)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
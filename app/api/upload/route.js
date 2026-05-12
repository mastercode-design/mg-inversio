import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs' // ← Esto es clave
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json({ error: 'No filename' }, { status: 400 })
    }

    const blob = await put(filename, request.body, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN // ← Forzamos el token
    })

    return NextResponse.json(blob)
  } catch (error) {
    console.error('UPLOAD ERROR:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
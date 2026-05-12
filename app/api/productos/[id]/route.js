import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { del } from '@vercel/blob';

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // 1. Obtén el producto primero para sacar la URL de la imagen
    const producto = await kv.get(`producto:${id}`);

    // 2. Borra la imagen del Blob si existe
    if (producto?.imagen) {
      await del(producto.imagen);
    }

    // 3. Borra el producto de KV
    await kv.del(`producto:${id}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
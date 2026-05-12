import { NextResponse } from 'next/server';
import { del } from '@vercel/blob'; // solo si guardas el blobUrl y quieres borrarlo también

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // 1. Aquí borras de tu base de datos/KV
    // Si usas Vercel KV:
    // await kv.del(`producto:${id}`);

    // 2. Opcional: borra la imagen del Blob si guardaste la URL
    // const producto = await kv.get(`producto:${id}`);
    // if (producto?.imagen) {
    // await del(producto.imagen);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
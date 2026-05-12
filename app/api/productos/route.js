import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Listar todos los productos
export async function GET() {
  try {
    const keys = await kv.keys('producto:*');
    const productos = await kv.mget(...keys);
    const productosValidos = productos.filter(Boolean);
    
    return NextResponse.json(productosValidos, {
      headers: { 'Cache-Control': 'no-store, max-age=0' }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Crear producto
export async function POST(request) {
  try {
    const body = await request.json();
    const id = Date.now().toString();
    
    const producto = {
      id,
      nombre: body.nombre,
      precio: body.precio,
      categoria: body.categoria,
      imagen: body.imagen,
      creado: new Date().toISOString()
    };
    
    await kv.set(`producto:${id}`, producto);
    
    return NextResponse.json(producto);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
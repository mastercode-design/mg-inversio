import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-playfair'
})

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-inter'
})

export const metadata = {
  title: 'MG INVERSION',
  description: 'Bolsos y Ropa Premium para Dama y Caballero',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              color: '#D4AF37',
              border: '1px solid rgba(212, 175, 55, 0.3)',
            },
          }}
        />
      </body>
    </html>
  )
}
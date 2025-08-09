import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Fotos del Casamiento',
  description: 'Comparte tus fotos de la fiesta de casamiento',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gradient-to-br from-wedding-50 to-wedding-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { PhotoGallery } from '@/components/PhotoGallery'

interface Photo {
  id: string
  url: string
  publicId: string
  uploadedAt: string
  fileName: string
}

export default function AdminPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/photos')
      if (response.ok) {
        const data = await response.json()
        setPhotos(data.photos)
      } else {
        setError('Error al cargar las fotos')
      }
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const downloadAllPhotos = async () => {
    try {
      const response = await fetch('/api/photos/download-all')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'fotos-casamiento.zip'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error descargando fotos:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-wedding-600 mx-auto mb-4"></div>
          <p className="text-wedding-600 text-lg">Cargando fotos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchPhotos}
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-8 px-4 bg-gradient-to-br from-wedding-50 to-wedding-100">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
                           <h1 className="text-5xl md:text-6xl font-elegant font-bold text-wedding-800 mb-4">
                   🎭 Panel de Administración
                 </h1>
                 <p className="text-xl text-wedding-700 max-w-2xl mx-auto">
                   Aquí puedes ver todas las fotos y videos que han subido tus invitados
                 </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                           <div className="card text-center">
                   <div className="text-4xl text-wedding-600 mb-2">📸📹</div>
                   <div className="text-3xl font-bold text-wedding-800">{photos.length}</div>
                   <div className="text-wedding-600">Archivos Subidos</div>
                 </div>
          
          <div className="card text-center">
            <div className="text-4xl text-wedding-600 mb-2">👥</div>
            <div className="text-3xl font-bold text-wedding-800">
              {new Set(photos.map(p => p.fileName.split('_')[0])).size}
            </div>
            <div className="text-wedding-600">Participantes</div>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl text-wedding-600 mb-2">💾</div>
            <div className="text-3xl font-bold text-wedding-800">
              {Math.round(photos.reduce((acc, p) => acc + (p.url.length * 0.001), 0) / 1000)} MB
            </div>
            <div className="text-wedding-600">Espacio Usado</div>
          </div>
        </div>

        {/* Actions */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                               <button
                     onClick={downloadAllPhotos}
                     className="btn-primary"
                     disabled={photos.length === 0}
                   >
                     📥 Descargar Todos los Archivos
                   </button>
            
            <button
              onClick={fetchPhotos}
              className="btn-secondary"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <PhotoGallery photos={photos} />
        ) : (
                           <div className="card text-center py-16">
                   <div className="text-6xl text-wedding-300 mb-4">📷📹</div>
                   <h3 className="text-2xl font-semibold text-wedding-700 mb-2">
                     No hay archivos aún
                   </h3>
                   <p className="text-wedding-600">
                     Los archivos que suban tus invitados aparecerán aquí
                   </p>
                 </div>
        )}
      </div>
    </main>
  )
}

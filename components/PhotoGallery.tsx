'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  publicId: string
  uploadedAt: string
  fileName: string
  resourceType?: string
  duration?: number
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const downloadPhoto = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = photo.fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error descargando foto:', error)
    }
  }

  const deletePhoto = async (photo: Photo) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) return
    
    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Recargar la página para actualizar la lista
        window.location.reload()
      }
    } catch (error) {
      console.error('Error eliminando foto:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
                       <h3 className="text-2xl font-semibold text-wedding-800">
                 Galería de Archivos ({photos.length})
               </h3>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-wedding-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🟀
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-wedding-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
                                   <div className="aspect-square relative">
                       {photo.resourceType === 'video' ? (
                         <video
                           src={photo.url}
                           className="w-full h-full object-cover"
                           muted
                           loop
                           onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                           onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                         />
                       ) : (
                         <Image
                           src={photo.url}
                           alt={photo.fileName}
                           fill
                           className="object-cover"
                           sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                         />
                       )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center">
                    <p className="text-sm font-medium">Ver foto</p>
                  </div>
                </div>
              </div>
              
              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate" title={photo.fileName}>
                  {photo.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(photo.uploadedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
                                   <div className="w-16 h-16 relative flex-shrink-0">
                       {photo.resourceType === 'video' ? (
                         <video
                           src={photo.url}
                           className="w-full h-full object-cover rounded-lg"
                           muted
                           loop
                           onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                           onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                         />
                       ) : (
                         <Image
                           src={photo.url}
                           alt={photo.fileName}
                           fill
                           className="object-cover rounded-lg"
                           sizes="64px"
                         />
                       )}
                     </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate" title={photo.fileName}>
                  {photo.fileName}
                </p>
                <p className="text-sm text-gray-500">
                  Subida el {formatDate(photo.uploadedAt)}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => downloadPhoto(photo)}
                  className="p-2 text-wedding-600 hover:bg-wedding-50 rounded-lg transition-colors"
                  title="Descargar"
                >
                  📥
                </button>
                <button
                  onClick={() => setSelectedPhoto(photo)}
                  className="p-2 text-wedding-600 hover:bg-wedding-50 rounded-lg transition-colors"
                  title="Ver"
                >
                  👁️
                </button>
                <button
                  onClick={() => deletePhoto(photo)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                   <h3 className="text-lg font-semibold text-gray-900">
                       {selectedPhoto.fileName}
                       {selectedPhoto.resourceType === 'video' && (
                         <span className="ml-2 text-sm text-blue-600">🎬 Video</span>
                       )}
                     </h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4">
                                   <div className="relative w-full max-h-[60vh] mb-4">
                       {selectedPhoto.resourceType === 'video' ? (
                         <video
                           src={selectedPhoto.url}
                           controls
                           className="w-full h-auto max-h-full"
                           autoPlay
                           loop
                         />
                       ) : (
                         <Image
                           src={selectedPhoto.url}
                           alt={selectedPhoto.fileName}
                           width={800}
                           height={600}
                           className="w-full h-auto max-h-full object-contain"
                         />
                       )}
                     </div>
              
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subida el {formatDate(selectedPhoto.uploadedAt)}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => downloadPhoto(selectedPhoto)}
                    className="btn-primary text-sm"
                  >
                    📥 Descargar
                  </button>
                  <button
                    onClick={() => deletePhoto(selectedPhoto)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

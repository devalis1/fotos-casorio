'use client'

import { useState, useRef } from 'react'
import { PhotoUploader } from '@/components/PhotoUploader'
import { UploadProgress } from '@/components/UploadProgress'

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return
    
    const fileArray = Array.from(files)
    setUploadedFiles(prev => [...prev, ...fileArray])
    
    // Iniciar subida automáticamente
    handleUpload(fileArray)
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    
    const newProgress: {[key: string]: number} = {}
    files.forEach(file => {
      newProgress[file.name] = 0
    })
    setUploadProgress(newProgress)

    // Simular subida en paralelo para cada archivo
    const uploadPromises = files.map(async (file) => {
      try {
        const formData = new FormData()
        formData.append('photo', file)
        
        // Simular progreso de subida
        const interval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: Math.min(prev[file.name] + Math.random() * 20, 90)
          }))
        }, 200)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        clearInterval(interval)
        
        if (response.ok) {
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: 100
          }))
          
          // Remover archivo de la lista después de un delay
          setTimeout(() => {
            setUploadedFiles(prev => prev.filter(f => f.name !== file.name))
            setUploadProgress(prev => {
              const newProgress = { ...prev }
              delete newProgress[file.name]
              return newProgress
            })
          }, 2000)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: -1 // Error
        }))
      }
    })

    await Promise.all(uploadPromises)
    setIsUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
                           <h1 className="text-5xl md:text-6xl font-elegant font-bold text-wedding-800 mb-4">
                   📸📹 Fotos y Videos del Casamiento
                 </h1>
                 <p className="text-xl text-wedding-700 max-w-2xl mx-auto">
                   ¡Comparte tus mejores momentos de la fiesta! Sube todas las fotos y videos que quieras y
                   nosotros nos encargamos del resto.
                 </p>
        </div>

        {/* Upload Area */}
        <div className="card mb-8">
          <PhotoUploader
            onFileSelect={handleFileSelect}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            fileInputRef={fileInputRef}
            isUploading={isUploading}
          />
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-wedding-800 mb-4">
              Progreso de Subida
            </h3>
            <div className="space-y-3">
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <UploadProgress
                  key={fileName}
                  fileName={fileName}
                  progress={progress}
                />
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="card inline-block">
            <h3 className="text-lg font-semibold text-wedding-800 mb-2">
              💡 ¿Cómo funciona?
            </h3>
            <ul className="text-wedding-700 text-left space-y-1">
                                   <li>• Selecciona las fotos y videos que quieras compartir</li>
                     <li>• Los archivos se suben automáticamente a la nube</li>
                     <li>• No necesitas esperar, puedes seguir usando tu teléfono</li>
                     <li>• ¡Nosotros nos encargamos de organizarlos!</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}

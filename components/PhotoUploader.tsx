'use client'

import { RefObject } from 'react'

interface PhotoUploaderProps {
  onFileSelect: (files: FileList | null) => void
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  fileInputRef: RefObject<HTMLInputElement>
  isUploading: boolean
}

export function PhotoUploader({
  onFileSelect,
  onDrop,
  onDragOver,
  fileInputRef,
  isUploading
}: PhotoUploaderProps) {
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="text-center">
                   <h2 className="text-2xl font-elegant font-semibold text-wedding-800 mb-6">
               Sube tus fotos y videos aquí
             </h2>
      
      <div
        className={`
          border-2 border-dashed border-wedding-300 rounded-xl p-12 mb-6
          transition-all duration-200 cursor-pointer
          ${isUploading 
            ? 'border-wedding-400 bg-wedding-50' 
            : 'hover:border-wedding-400 hover:bg-wedding-50'
          }
        `}
        onClick={handleClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <div className="space-y-4">
          <div className="text-6xl">📱</div>
          <div className="space-y-2">
                               <p className="text-lg font-medium text-wedding-700">
                     {isUploading ? 'Subiendo archivos...' : 'Toca aquí para seleccionar fotos y videos'}
                   </p>
                   <p className="text-wedding-600">
                     O arrastra y suelta los archivos aquí
                   </p>
          </div>
          
          {!isUploading && (
                               <button
                     className="btn-primary mt-4"
                     onClick={(e) => {
                       e.stopPropagation()
                       handleClick()
                     }}
                   >
                     Seleccionar Archivos
                   </button>
          )}
        </div>
      </div>

                   <input
               ref={fileInputRef}
               type="file"
               multiple
               accept="image/*,video/*"
               onChange={(e) => onFileSelect(e.target.files)}
               className="hidden"
             />

             <div className="text-sm text-wedding-600">
               <p>Formatos soportados: JPG, PNG, HEIC, MP4, MOV, AVI</p>
               <p>Puedes seleccionar múltiples archivos a la vez</p>
             </div>
    </div>
  )
}

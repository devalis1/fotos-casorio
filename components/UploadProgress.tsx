'use client'

interface UploadProgressProps {
  fileName: string
  progress: number
}

export function UploadProgress({ fileName, progress }: UploadProgressProps) {
  const getProgressColor = (progress: number) => {
    if (progress === -1) return 'bg-red-500' // Error
    if (progress === 100) return 'bg-green-500' // Complete
    return 'bg-wedding-500' // In progress
  }

  const getProgressText = (progress: number) => {
    if (progress === -1) return 'Error en la subida'
    if (progress === 100) return '¡Subida completada!'
    return `${Math.round(progress)}%`
  }

  const getProgressIcon = (progress: number) => {
    if (progress === -1) return '❌'
    if (progress === 100) return '✅'
    if (progress > 0) return '📤'
    return '⏳'
  }

  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl">
        {getProgressIcon(progress)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium text-gray-700 truncate">
            {fileName}
          </p>
          <span className={`text-sm font-medium ${
            progress === -1 ? 'text-red-600' : 
            progress === 100 ? 'text-green-600' : 
            'text-wedding-600'
          }`}>
            {getProgressText(progress)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
            style={{ width: progress === -1 ? '100%' : `${Math.max(0, progress)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

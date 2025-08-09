import { v2 as cloudinary } from 'cloudinary'

// Validar variables de entorno
const requiredEnvVars = {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
}

// Verificar que todas las variables estén definidas
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Variable de entorno ${key} no está definida`)
  }
}

// Configurar Cloudinary con timeout y reintentos
cloudinary.config({
  cloud_name: requiredEnvVars.CLOUDINARY_CLOUD_NAME!,
  api_key: requiredEnvVars.CLOUDINARY_API_KEY!,
  api_secret: requiredEnvVars.CLOUDINARY_API_SECRET!,
  secure: true, // Usar HTTPS
})

// Función para validar la configuración
export const validateCloudinaryConfig = async () => {
  try {
    console.log('🔍 DEBUG: Validando configuración de Cloudinary...')
    
    // Verificar que las credenciales sean válidas haciendo un ping
    const result = await cloudinary.api.ping()
    console.log('✅ DEBUG: Ping exitoso a Cloudinary:', result)
    
    return result
  } catch (error) {
    console.error('❌ Error validando configuración de Cloudinary:', error)
    
    // Proporcionar información más detallada sobre el error
    if (error && typeof error === 'object' && 'http_code' in error) {
      const cloudinaryError = error as any
      console.error('❌ ERROR Cloudinary específico:', {
        http_code: cloudinaryError.http_code,
        message: cloudinaryError.message,
        name: cloudinaryError.name
      })
      
      // Si es un error de autenticación, dar información específica
      if (cloudinaryError.http_code === 401) {
        throw new Error('Credenciales de Cloudinary inválidas. Verifica tu API Key y API Secret.')
      }
      
      if (cloudinaryError.http_code === 403) {
        throw new Error('Acceso denegado a Cloudinary. Verifica tu Cloud Name y permisos.')
      }
    }
    
    throw error
  }
}

// Función para subir archivo con reintentos
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  mimeType: string,
  options: {
    folder?: string
    public_id?: string
    overwrite?: boolean
    maxRetries?: number
  } = {}
) => {
  const maxRetries = options.maxRetries || 3
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔍 DEBUG: Intento ${attempt}/${maxRetries} de subida a Cloudinary`)
      
      // Convertir buffer a base64
      const base64String = fileBuffer.toString('base64')
      const dataURI = `data:${mimeType};base64,${base64String}`

      // Configuración por defecto
      const uploadOptions = {
        resource_type: 'auto' as const,
        folder: options.folder || 'fotos-casamiento',
        use_filename: true,
        unique_filename: true,
        overwrite: options.overwrite || false,
        invalidate: true,
        ...options
      }

      console.log('🔍 DEBUG: Subiendo a Cloudinary con opciones:', uploadOptions)

      const result = await cloudinary.uploader.upload(dataURI, uploadOptions)
      
      console.log('✅ SUCCESS: Archivo subido exitosamente:', result.public_id)
      
      return {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
        created_at: result.created_at
      }
    } catch (error) {
      lastError = error
      console.error(`❌ ERROR en intento ${attempt}/${maxRetries}:`, error)
      
      // Si es el último intento, no esperar
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 // Backoff exponencial
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // Si llegamos aquí, todos los intentos fallaron
  console.error('❌ ERROR: Todos los intentos de subida fallaron')
  throw lastError
}

// Función para verificar el estado de la cuenta
export const checkCloudinaryAccountStatus = async () => {
  try {
    const result = await cloudinary.api.usage()
    console.log('✅ DEBUG: Estado de cuenta Cloudinary:', result)
    return result
  } catch (error) {
    console.error('❌ ERROR verificando estado de cuenta:', error)
    throw error
  }
}

export default cloudinary

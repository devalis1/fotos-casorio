import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary, validateCloudinaryConfig } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Iniciando upload...')
    
    // Validar configuración de Cloudinary
    try {
      await validateCloudinaryConfig()
      console.log('✅ DEBUG: Configuración de Cloudinary válida')
    } catch (error) {
      console.log('❌ ERROR: Configuración de Cloudinary inválida:', error)
      return NextResponse.json(
        { error: 'Error en la configuración de Cloudinary' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('photo') as File

    if (!file) {
      console.log('❌ ERROR: No se encontró archivo en campo "photo"')
      return NextResponse.json(
        { error: 'No se encontró archivo en campo "photo"' }, 
        { status: 400 }
      )
    }

    console.log('🔍 DEBUG: Archivo recibido:', file.name, 'Tamaño:', file.size, 'Tipo:', file.type)

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      console.log('❌ ERROR: Tipo de archivo no válido:', file.type)
      return NextResponse.json(
        { error: 'Solo se permiten archivos de imagen' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.log('❌ ERROR: Archivo demasiado grande:', file.size, 'bytes')
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      )
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('🔍 DEBUG: Buffer creado, tamaño:', buffer.length)

    // Subir a Cloudinary
    const result = await uploadToCloudinary(buffer, file.type, {
      folder: 'fotos-casamiento'
    })

    console.log('✅ SUCCESS: Upload completado exitosamente')

    return NextResponse.json({ 
      success: true, 
      data: result
    })

  } catch (error) {
    console.log('❌ ERROR GENERAL:', error)
    
    // Manejar errores específicos de Cloudinary
    if (error && typeof error === 'object' && 'http_code' in error) {
      const cloudinaryError = error as any
      console.log('❌ ERROR Cloudinary específico:', {
        http_code: cloudinaryError.http_code,
        message: cloudinaryError.message,
        name: cloudinaryError.name
      })
      
      return NextResponse.json(
        { 
          error: 'Error en Cloudinary',
          details: cloudinaryError.message,
          code: cloudinaryError.http_code
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Error en el servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

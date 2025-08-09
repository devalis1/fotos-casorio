import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    // Verificar configuración de Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Configuración de Cloudinary no encontrada' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('photo') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

               // Verificar que sea una imagen o video
           if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
             return NextResponse.json(
               { error: 'Solo se permiten archivos de imagen o video' },
               { status: 400 }
             )
           }

    // Convertir File a Buffer para Cloudinary
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

               // Determinar el tipo de recurso
           const isVideo = file.type.startsWith('video/')
           const resourceType = isVideo ? 'video' : 'image'
           const folder = isVideo ? 'casamiento-videos' : 'casamiento-fotos'
           
           // Subir a Cloudinary
           const result = await new Promise((resolve, reject) => {
             const uploadStream = cloudinary.uploader.upload_stream(
               {
                 folder: folder,
                 resource_type: resourceType,
                 transformation: isVideo ? [
                   { quality: 'auto:good' }, // Optimizar calidad automáticamente
                   { fetch_format: 'auto' }  // Formato automático
                 ] : [
                   { quality: 'auto:good' }, // Optimizar calidad automáticamente
                   { fetch_format: 'auto' }  // Formato automático
                 ]
               },
               (error, result) => {
                 if (error) reject(error)
                 else resolve(result)
               }
             )

             uploadStream.end(buffer)
           })

    // Guardar información en la base de datos (opcional)
    // Aquí podrías guardar metadata como fecha, nombre del archivo, etc.

    return NextResponse.json({
      success: true,
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      message: 'Foto subida exitosamente'
    })

  } catch (error) {
    console.error('Error en la subida:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Configurar límites de tamaño y comportamiento de la ruta
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutos para subidas grandes

import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
               // Obtener todas las fotos y videos de Cloudinary
           const [fotosResult, videosResult] = await Promise.all([
             cloudinary.api.resources({
               type: 'upload',
               prefix: 'casamiento-fotos/',
               max_results: 500,
               sort_by: 'created_at',
               sort_direction: 'desc'
             }),
             cloudinary.api.resources({
               type: 'upload',
               prefix: 'casamiento-videos/',
               max_results: 500,
               sort_by: 'created_at',
               sort_direction: 'desc'
             })
           ])

               // Combinar y transformar los resultados
           const allResources = [...fotosResult.resources, ...videosResult.resources]
           
           // Ordenar por fecha de creación (más reciente primero)
           allResources.sort((a: any, b: any) => 
             new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
           )
           
           const photos = allResources.map((resource: any) => ({
             id: resource.public_id,
             url: resource.secure_url,
             publicId: resource.public_id,
             uploadedAt: resource.created_at,
             fileName: resource.original_filename || resource.public_id.split('/').pop(),
             size: resource.bytes,
             format: resource.format,
             width: resource.width,
             height: resource.height,
             resourceType: resource.resource_type || 'image',
             duration: resource.duration || null
           }))

    return NextResponse.json({
      success: true,
      photos,
      total: photos.length
    })

  } catch (error) {
    console.error('Error obteniendo fotos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

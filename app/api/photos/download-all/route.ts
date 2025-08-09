import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import JSZip from 'jszip'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Verificar configuración de Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Configuración de Cloudinary no encontrada' },
        { status: 500 }
      )
    }

    // Obtener todas las fotos y videos
    const [fotosResult, videosResult] = await Promise.all([
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'casamiento-fotos/',
        max_results: 500
      }),
      cloudinary.api.resources({
        type: 'upload',
        prefix: 'casamiento-videos/',
        max_results: 500
      })
    ])
           
           const allResources = [...fotosResult.resources, ...videosResult.resources]

               if (allResources.length === 0) {
             return NextResponse.json(
               { error: 'No hay archivos para descargar' },
               { status: 404 }
             )
           }

           // Crear ZIP
           const zip = new JSZip()
           const folder = zip.folder('fotos-casamiento')

           // Descargar y agregar cada archivo al ZIP
           const downloadPromises = allResources.map(async (resource: any) => {
      try {
        const response = await fetch(resource.secure_url)
        const buffer = await response.arrayBuffer()
        
        const fileName = resource.original_filename || 
          `${resource.public_id.split('/').pop()}.${resource.format}`
        
        folder?.file(fileName, buffer)
      } catch (error) {
        console.error(`Error descargando ${resource.public_id}:`, error)
      }
    })

    await Promise.all(downloadPromises)

    // Generar ZIP
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' })

    // Crear respuesta con headers apropiados usando Response nativo
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="fotos-casamiento.zip"',
        'Content-Length': zipBuffer.byteLength.toString()
      }
    })

  } catch (error) {
    console.error('Error creando ZIP:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

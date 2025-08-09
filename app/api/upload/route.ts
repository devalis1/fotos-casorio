import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    // Log para debug
    console.log('🔍 DEBUG: Iniciando upload...')
    console.log('🔍 DEBUG: CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ SET' : '❌ NOT SET')
    console.log('🔍 DEBUG: CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ SET' : '❌ NOT SET')
    console.log('🔍 DEBUG: CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ NOT SET')
    
    // Verificar configuración de Cloudinary
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log('❌ ERROR: Variables de Cloudinary faltantes')
      return NextResponse.json(
        { 
          error: 'Configuración de Cloudinary no encontrada',
          debug: {
            cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: !!process.env.CLOUDINARY_API_KEY,
            apiSecret: !!process.env.CLOUDINARY_API_SECRET
          }
        },
        { status: 500 }
      )
    }

    // Configurar Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    console.log('🔍 DEBUG: Cloudinary configurado correctamente')

    const formData = await request.formData()
    const file = formData.get('photo') as File

    if (!file) {
      console.log('❌ ERROR: No se encontró archivo en campo "photo"')
      return NextResponse.json({ error: 'No se encontró archivo en campo "photo"' }, { status: 400 })
    }

    console.log('🔍 DEBUG: Archivo recibido:', file.name, 'Tamaño:', file.size)

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log('🔍 DEBUG: Buffer creado, tamaño:', buffer.length)

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'fotos-casamiento',
        },
        (error, result) => {
          if (error) {
            console.log('❌ ERROR Cloudinary:', error)
            reject(error)
          } else {
            console.log('✅ SUCCESS: Imagen subida a Cloudinary')
            resolve(result)
          }
        }
      ).end(buffer)
    })

    console.log('🔍 DEBUG: Upload completado, resultado:', result)

    return NextResponse.json({ 
      success: true, 
      data: result,
      debug: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
      }
    })

  } catch (error) {
    console.log('❌ ERROR GENERAL:', error)
    return NextResponse.json(
      { 
        error: 'Error en el servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        debug: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
          apiSecret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET'
        }
      },
      { status: 500 }
    )
  }
}

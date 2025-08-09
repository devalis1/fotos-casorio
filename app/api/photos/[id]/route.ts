import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de foto requerido' },
        { status: 400 }
      )
    }

    // Eliminar foto de Cloudinary
    const result = await cloudinary.uploader.destroy(id)

    if (result.result === 'ok') {
      return NextResponse.json({
        success: true,
        message: 'Foto eliminada exitosamente'
      })
    } else {
      return NextResponse.json(
        { error: 'Error eliminando foto de Cloudinary' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error eliminando foto:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

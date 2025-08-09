import { NextResponse } from 'next/server'
import { validateCloudinaryConfig } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('🔍 DEBUG: Probando configuración de Cloudinary...')
    
    // Verificar variables de entorno
    const envVars = {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    }
    
    console.log('🔍 DEBUG: Variables de entorno:', {
      cloudName: envVars.CLOUDINARY_CLOUD_NAME ? '✅ SET' : '❌ NOT SET',
      apiKey: envVars.CLOUDINARY_API_KEY ? '✅ SET' : '❌ NOT SET',
      apiSecret: envVars.CLOUDINARY_API_SECRET ? '✅ SET' : '❌ NOT SET',
    })
    
    // Validar configuración
    const pingResult = await validateCloudinaryConfig()
    
    console.log('✅ SUCCESS: Ping a Cloudinary exitoso:', pingResult)
    
    return NextResponse.json({
      success: true,
      message: 'Configuración de Cloudinary válida',
      ping: pingResult,
      envVars: {
        cloudName: !!envVars.CLOUDINARY_CLOUD_NAME,
        apiKey: !!envVars.CLOUDINARY_API_KEY,
        apiSecret: !!envVars.CLOUDINARY_API_SECRET,
      }
    })
    
  } catch (error) {
    console.log('❌ ERROR en test de Cloudinary:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Error en la configuración de Cloudinary',
      details: error instanceof Error ? error.message : 'Error desconocido',
      envVars: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET,
      }
    }, { status: 500 })
  }
}

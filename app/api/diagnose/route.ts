import { NextResponse } from 'next/server'
import { validateCloudinaryConfig, checkCloudinaryAccountStatus } from '@/lib/cloudinary'

export const dynamic = 'force-dynamic'

export async function GET() {
  const diagnosis = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cloudinary: {
      config: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET,
      },
      values: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME ? `${process.env.CLOUDINARY_CLOUD_NAME.substring(0, 3)}...` : 'NOT SET',
        apiKey: process.env.CLOUDINARY_API_KEY ? `${process.env.CLOUDINARY_API_KEY.substring(0, 8)}...` : 'NOT SET',
        apiSecret: process.env.CLOUDINARY_API_SECRET ? `${process.env.CLOUDINARY_API_SECRET.substring(0, 8)}...` : 'NOT SET',
      },
      connection: null as any,
      accountStatus: null as any,
      errors: [] as string[]
    }
  }

  try {
    console.log('🔍 DEBUG: Iniciando diagnóstico completo...')
    
    // 1. Verificar variables de entorno
    console.log('🔍 DEBUG: Verificando variables de entorno...')
    const missingVars = []
    
    if (!process.env.CLOUDINARY_CLOUD_NAME) missingVars.push('CLOUDINARY_CLOUD_NAME')
    if (!process.env.CLOUDINARY_API_KEY) missingVars.push('CLOUDINARY_API_KEY')
    if (!process.env.CLOUDINARY_API_SECRET) missingVars.push('CLOUDINARY_API_SECRET')
    
    if (missingVars.length > 0) {
      diagnosis.cloudinary.errors.push(`Variables faltantes: ${missingVars.join(', ')}`)
      console.log('❌ ERROR: Variables de entorno faltantes:', missingVars)
    } else {
      console.log('✅ DEBUG: Todas las variables de entorno están configuradas')
    }

    // 2. Probar conexión a Cloudinary
    if (missingVars.length === 0) {
      try {
        console.log('🔍 DEBUG: Probando conexión a Cloudinary...')
        const pingResult = await validateCloudinaryConfig()
        diagnosis.cloudinary.connection = {
          status: 'success',
          ping: pingResult,
          message: 'Conexión exitosa a Cloudinary'
        }
        console.log('✅ DEBUG: Conexión a Cloudinary exitosa')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        diagnosis.cloudinary.errors.push(`Error de conexión: ${errorMessage}`)
        diagnosis.cloudinary.connection = {
          status: 'error',
          error: errorMessage
        }
        console.log('❌ ERROR: Fallo en conexión a Cloudinary:', errorMessage)
      }

      // 3. Verificar estado de la cuenta
      if (diagnosis.cloudinary.connection?.status === 'success') {
        try {
          console.log('🔍 DEBUG: Verificando estado de cuenta...')
          const accountStatus = await checkCloudinaryAccountStatus()
          diagnosis.cloudinary.accountStatus = {
            status: 'success',
            data: accountStatus
          }
          console.log('✅ DEBUG: Estado de cuenta verificado')
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
          diagnosis.cloudinary.errors.push(`Error verificando cuenta: ${errorMessage}`)
          diagnosis.cloudinary.accountStatus = {
            status: 'error',
            error: errorMessage
          }
          console.log('❌ ERROR: Fallo verificando estado de cuenta:', errorMessage)
        }
      }
    }

    // 4. Resumen del diagnóstico
    const hasErrors = diagnosis.cloudinary.errors.length > 0
    const isConfigValid = diagnosis.cloudinary.config.cloudName && 
                         diagnosis.cloudinary.config.apiKey && 
                         diagnosis.cloudinary.config.apiSecret
    const isConnectionValid = diagnosis.cloudinary.connection?.status === 'success'

    diagnosis.summary = {
      overall: hasErrors ? 'error' : 'success',
      configValid: isConfigValid,
      connectionValid: isConnectionValid,
      totalErrors: diagnosis.cloudinary.errors.length,
      recommendations: []
    }

    // Generar recomendaciones
    if (!isConfigValid) {
      diagnosis.summary.recommendations.push('Configurar todas las variables de entorno de Cloudinary')
    }
    
    if (isConfigValid && !isConnectionValid) {
      diagnosis.summary.recommendations.push('Verificar que las credenciales de Cloudinary sean correctas')
      diagnosis.summary.recommendations.push('Verificar que la cuenta de Cloudinary esté activa')
    }
    
    if (isConnectionValid && diagnosis.cloudinary.accountStatus?.status === 'error') {
      diagnosis.summary.recommendations.push('Verificar permisos de la cuenta de Cloudinary')
    }

    console.log('✅ DEBUG: Diagnóstico completado')
    return NextResponse.json(diagnosis)

  } catch (error) {
    console.log('❌ ERROR en diagnóstico:', error)
    
    diagnosis.cloudinary.errors.push(`Error general: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    diagnosis.summary = {
      overall: 'error',
      configValid: false,
      connectionValid: false,
      totalErrors: diagnosis.cloudinary.errors.length,
      recommendations: ['Revisar logs del servidor para más detalles']
    }
    
    return NextResponse.json(diagnosis, { status: 500 })
  }
}

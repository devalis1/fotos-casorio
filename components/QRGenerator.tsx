'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

interface QRGeneratorProps {
  url: string
  title?: string
}

export function QRGenerator({ url, title = 'Escanea para subir fotos' }: QRGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('')

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#831843', // wedding-900
            light: '#FFFFFF'
          }
        })
        setQrDataUrl(dataUrl)
      } catch (error) {
        console.error('Error generando QR:', error)
      }
    }

    generateQR()
  }, [url])

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Código QR - Fotos del Casamiento</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                background: white;
              }
              .qr-container { 
                max-width: 400px; 
                margin: 0 auto; 
                padding: 20px;
                border: 2px solid #831843;
                border-radius: 15px;
              }
              .qr-code { 
                margin: 20px 0; 
              }
              .title { 
                font-size: 24px; 
                font-weight: bold; 
                color: #831843; 
                margin-bottom: 10px;
              }
              .subtitle { 
                font-size: 16px; 
                color: #666; 
                margin-bottom: 20px;
              }
              .instructions { 
                font-size: 14px; 
                color: #888; 
                line-height: 1.4;
              }
              @media print {
                body { margin: 0; }
                .qr-container { border: none; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="title">📸 Fotos del Casamiento</div>
              <div class="subtitle">${title}</div>
              <div class="qr-code">
                <img src="${qrDataUrl}" alt="Código QR" style="width: 250px; height: 250px;" />
              </div>
              <div class="instructions">
                <p><strong>Instrucciones:</strong></p>
                <p>1. Abre la cámara de tu teléfono</p>
                <p>2. Apunta al código QR</p>
                <p>3. Toca la notificación que aparece</p>
                <p>4. ¡Sube tus fotos!</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!qrDataUrl) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-600 mx-auto mb-4"></div>
        <p className="text-wedding-600">Generando código QR...</p>
      </div>
    )
  }

  return (
    <div className="card text-center">
      <h3 className="text-2xl font-elegant font-semibold text-wedding-800 mb-6">
        🎯 Código QR para Imprimir
      </h3>
      
      <div className="bg-white p-6 rounded-lg border-2 border-wedding-200 mb-6">
        <img 
          src={qrDataUrl} 
          alt="Código QR" 
          className="mx-auto mb-4"
          style={{ width: '250px', height: '250px' }}
        />
        <p className="text-sm text-wedding-600 mb-2">
          Escanea este código con tu teléfono
        </p>
        <p className="text-xs text-gray-500">
          {url}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handlePrint}
          className="btn-primary w-full"
        >
          🖨️ Imprimir Código QR
        </button>
        
        <button
          onClick={() => navigator.clipboard.writeText(url)}
          className="btn-secondary w-full"
        >
          📋 Copiar Enlace
        </button>
      </div>

      <div className="mt-6 text-left text-sm text-wedding-700">
        <p className="font-semibold mb-2">💡 Consejos para imprimir:</p>
        <ul className="space-y-1">
          <li>• Imprime en papel blanco de buena calidad</li>
          <li>• Asegúrate de que el código sea legible</li>
          <li>• Puedes imprimir varios y colocarlos en diferentes lugares</li>
          <li>• Considera laminar para proteger del agua</li>
        </ul>
      </div>
    </div>
  )
}

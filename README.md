# 📸 Fotos del Casamiento

Una aplicación web moderna y elegante para que los invitados de tu boda puedan subir fotos fácilmente durante la fiesta. Las fotos se almacenan en la nube y puedes acceder a ellas desde un panel de administración.

## ✨ Características

- **Interfaz súper simple**: Los invitados solo necesitan escanear un código QR
- **Subida automática**: Las fotos se suben en segundo plano sin interrumpir la fiesta
- **Compatible con móviles**: Funciona perfectamente en Android e iOS
- **Almacenamiento en la nube**: Todas las fotos se guardan en Cloudinary
- **Panel de administración**: Ve, descarga y gestiona todas las fotos subidas
- **Diseño elegante**: Interfaz moderna con colores de boda y Tailwind CSS

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <tu-repositorio>
cd fotos-casorio
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Cloudinary Configuration
# Obtén estas credenciales desde https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Opcional: URL de tu aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar Cloudinary
1. Ve a [Cloudinary](https://cloudinary.com/) y crea una cuenta gratuita
2. En tu dashboard, copia:
   - Cloud Name
   - API Key
   - API Secret
3. Pega estos valores en tu archivo `.env.local`

### 5. Ejecutar la aplicación
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📱 Cómo usar

### Para los invitados:
1. Escanean el código QR que imprimas y coloques en la fiesta
2. Se abre la página web en su teléfono
3. Tocan "Seleccionar Fotos" o arrastran las fotos
4. Las fotos se suben automáticamente a la nube
5. ¡Listo! Pueden seguir usando su teléfono

### Para ti (administrador):
1. Ve a `/admin` en tu aplicación
2. Ve todas las fotos subidas en tiempo real
3. Descarga fotos individuales o todas juntas en ZIP
4. Elimina fotos que no quieras

## 🎯 Generar códigos QR

La aplicación incluye un generador de códigos QR que puedes usar para:

1. **Imprimir códigos QR** para colocar en diferentes lugares de la fiesta
2. **Compartir el enlace** directamente por WhatsApp o redes sociales
3. **Personalizar el mensaje** que aparece al escanear

### Consejos para imprimir:
- Usa papel blanco de buena calidad
- Imprime en tamaño A4 o más grande
- Considera laminar para proteger del agua
- Coloca en lugares visibles y accesibles
- Puedes imprimir varios para diferentes áreas

## 🏗️ Estructura del proyecto

```
fotos-casorio/
├── app/                    # Next.js App Router
│   ├── api/               # APIs del backend
│   ├── admin/             # Panel de administración
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/             # Componentes React
│   ├── PhotoUploader.tsx  # Componente de subida
│   ├── UploadProgress.tsx # Barra de progreso
│   ├── PhotoGallery.tsx   # Galería de fotos
│   └── QRGenerator.tsx    # Generador de QR
├── public/                 # Archivos estáticos
└── package.json           # Dependencias
```

## 🔧 Tecnologías utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Almacenamiento**: Cloudinary
- **Generación QR**: qrcode
- **Compresión**: JSZip

## 📊 Funcionalidades técnicas

### Subida de archivos:
- Soporte para múltiples formatos (JPG, PNG, HEIC)
- Subida en paralelo para múltiples archivos
- Barra de progreso en tiempo real
- Validación de tipos de archivo
- Optimización automática de calidad

### Seguridad:
- Validación de tipos de archivo
- Límites de tamaño configurables
- Sanitización de nombres de archivo
- Acceso controlado al panel de administración

### Rendimiento:
- Lazy loading de imágenes
- Compresión automática de fotos
- Caché de Cloudinary
- Optimización de Next.js

## 🚀 Despliegue

### Vercel (Recomendado):
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. ¡Listo! Se despliega automáticamente

### Otros proveedores:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 💡 Personalización

### Cambiar colores:
Edita `tailwind.config.js` para cambiar la paleta de colores de boda.

### Agregar logo:
Reemplaza el emoji 📸 en `app/page.tsx` con tu logo personalizado.

### Modificar mensajes:
Edita los textos en los componentes para personalizar los mensajes.

## 🐛 Solución de problemas

### Error de Cloudinary:
- Verifica que las credenciales estén correctas
- Asegúrate de que tu cuenta tenga espacio disponible
- Revisa la consola del navegador para errores

### Fotos no se suben:
- Verifica la conexión a internet
- Asegúrate de que el archivo sea una imagen
- Revisa que no exceda el límite de tamaño

### Problemas en móviles:
- La aplicación es responsive y funciona en todos los dispositivos
- Si hay problemas, verifica que el navegador esté actualizado

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa este README
2. Busca en los issues del repositorio
3. Crea un nuevo issue con detalles del problema

## 🎉 ¡Disfruta tu boda!

Esta aplicación te permitirá capturar todos los momentos especiales de tu día sin que tengas que preocuparte por la tecnología. ¡Que tengas una boda maravillosa!

---

**Desarrollado con ❤️ para hacer tu día especial aún más memorable**

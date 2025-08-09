# 🔧 Configuración y Resolución de Problemas

## Problema Identificado
El error `Server return invalid JSON response. Status Code 500. SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` indica que Cloudinary está devolviendo HTML en lugar de JSON, lo que sugiere un problema de autenticación o configuración.

## 🚀 Solución Paso a Paso

### 1. Verificar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
CLOUDINARY_CLOUD_NAME=tu_cloud_name_real
CLOUDINARY_API_KEY=tu_api_key_real
CLOUDINARY_API_SECRET=tu_api_secret_real
```

### 2. Verificar Configuración en Vercel

En tu dashboard de Vercel, asegúrate de que las variables de entorno estén configuradas:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 3. Verificar Credenciales de Cloudinary

1. Ve a [Cloudinary Console](https://cloudinary.com/console)
2. Verifica que tu cuenta esté activa
3. Copia las credenciales exactas del dashboard
4. Asegúrate de que no haya espacios extra

### 4. Probar Configuración

Visita `/api/diagnose` para ver un diagnóstico completo de la configuración.

### 5. Verificar Permisos de Cuenta

En Cloudinary, asegúrate de que tu cuenta tenga permisos para:
- Subir archivos
- Crear carpetas
- Acceder a la API

## 🔍 Diagnóstico

### API de Diagnóstico
- **GET** `/api/diagnose` - Diagnóstico completo de la configuración
- **GET** `/api/test-cloudinary` - Prueba básica de conexión

### Logs a Revisar
- Variables de entorno configuradas
- Conexión exitosa a Cloudinary
- Estado de la cuenta
- Errores específicos de autenticación

## 🛠️ Cambios Implementados

1. **Configuración Robusta**: Mejorada la configuración de Cloudinary con validaciones
2. **Manejo de Errores**: Implementado manejo específico de errores de Cloudinary
3. **Reintentos**: Sistema de reintentos automáticos para subidas fallidas
4. **Validación**: Verificación de configuración antes de intentar subidas
5. **Diagnóstico**: APIs para identificar problemas de configuración

## 📝 Formato de Variables de Entorno

```bash
# ✅ CORRECTO
CLOUDINARY_CLOUD_NAME=mycloud123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# ❌ INCORRECTO (con espacios o caracteres extra)
CLOUDINARY_CLOUD_NAME= mycloud123 
CLOUDINARY_API_KEY= 123456789012345
CLOUDINARY_API_SECRET= abcdefghijklmnopqrstuvwxyz123
```

## 🔄 Después de Cambios

1. Reinicia el servidor de desarrollo
2. Verifica la configuración con `/api/diagnose`
3. Prueba subir una imagen pequeña
4. Revisa los logs para confirmar que funciona

## 📞 Soporte

Si el problema persiste:
1. Revisa los logs del servidor
2. Verifica el diagnóstico en `/api/diagnose`
3. Confirma las credenciales en Cloudinary Console
4. Verifica que la cuenta de Cloudinary esté activa

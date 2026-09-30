# Optimización de imágenes

`StoreImage` usa un loader de Cloudinary para generar variantes responsivas con
ancho limitado, calidad automática y formato automático. Se conservan las
rotaciones anteriores a la versión del recurso. Las fuentes locales, previews
y URLs firmadas se sirven sin transformación. No se migran archivos ni se
cambian las URLs persistidas. El zoom conserva el original.

Las variantes se generan en Cloudinary y consumen su cuota de transformaciones;
revisar su uso después del despliegue. No se necesita instalar sharp para este
flujo. Las imágenes locales se entregan con su tamaño original.

## Subidas

- Productos: hasta 5 fotos totales, 2 MB por foto nueva y 8 MB nuevos por guardado.
- Logo: hasta 1 MB. Carrusel: hasta 2 MB por imagen.
- Tipos admitidos: JPEG, PNG y WebP. Validación en cliente y servidor.
- Subida secuencial mediante upload_stream, sin copias base64.
- Si una subida falla, no se guarda el producto. Las imágenes ya subidas antes
  del fallo pueden quedar en Cloudinary; no se eliminan automáticamente.
- El cuerpo de Server Actions tiene un límite de 10 MB para incluir los campos
  y delimitadores. Next.js 14.0.1 instalado utiliza serverActionsBodySizeLimit.

## Verificación

Ejecutar desde marioFront:

```sh
node scripts/check-image-optimization.cjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run lint
npm run build
```

La comprobación usa servicios simulados para validar autorización, límites,
secuencialidad y fallo de subida sin guardar el producto. También verifica
rotaciones, URLs firmadas/locales y HTML sin /_next/image.

Antes de publicar, probar con la API de desarrollo: portada, detalle y zoom,
carrito, pedido y administrador; imágenes giradas y previews; límites de subida
y errores de conexión. No usar pagos ni pedidos reales.

Después del despliegue, comprobar en Network que las fotos soliciten variantes
directamente a res.cloudinary.com y comparar memoria, reinicios y 502 en Render.
La reducción efectiva de memoria debe medirse: estos cambios no demuestran por
sí solos que las imágenes fueran el origen de todos los fallos.

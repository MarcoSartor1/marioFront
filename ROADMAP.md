}
# Roadmap — Teslo Shop

## Estado actual de la app

### Tienda pública
- [x] Home con grilla de productos paginada
- [x] Listado por género (`/gender/[gender]`) y por categoría (`/category/[category]`)
- [x] Detalle de producto: galería desktop/mobile, selector de talla y cantidad, stock label, agregar al carrito
- [x] Carrito con resumen de orden
- [x] Checkout: formulario de dirección + confirmar orden
- [x] Página de orden con botón MercadoPago
- [x] Páginas de resultado: success / failure / pending
- [x] Historial de órdenes del usuario
- [x] Perfil: editar nombre + cambiar contraseña

### Autenticación
- [x] Login y registro con credenciales

### Panel Admin
- [x] ABM de productos (formulario + imágenes + bulk upload CSV)
- [x] Órdenes: lista filtrable por estado, ver detalle en modal, actualizar estado con confirmación
- [x] Usuarios: listado + cambio de rol
- [x] ABM de categorías dinámicas
- [x] StoreConfig: nombre, logo, colores, datos bancarios, info de envío, contacto (white-label)

### Pagos
- [x] MercadoPago (preferencia via backend NestJS)
- [x] Transferencia manual — selector en checkout, datos bancarios del StoreConfig, subida de comprobante

---

## Pendiente

### Alta prioridad — afecta el flujo de compra

- [x] **Subida de comprobante de transferencia**
  - Selector de método de pago en `PlaceOrder.tsx` (MercadoPago / Transferencia)
  - `TransferPaymentSection`: muestra datos bancarios del StoreConfig + upload de comprobante (jpg/png/pdf, max 5MB)
  - Backend: `PATCH /orders/:id/payment-receipt` → Cloudinary, cambia status a `processing`

- [x] **Descuento de stock al confirmar pago**
  - Backend descuenta `inStock` en transacción al confirmar pago (webhook MP o admin cambia a `paid`)
  - Guarda contra doble descuento si ya estaba pagada

- [x] **Emails transaccionales**
  - Backend: nodemailer con templates HTML usando logo/colores del StoreConfig
  - Eventos: orden creada, pago confirmado, enviado, entregado
  - Si el método es transferencia, el email de orden creada incluye datos bancarios

- [ ] **Integración API de envíos**
  - Calcular costo de envío real en el checkout según dirección, peso y volumen
  - El total actual es subtotal + impuesto fijo sin costo de envío real
  - Candidatos: Andreani, OCA, Correo Argentino, ShipNow, etc.

### Prioridad media — UX importante

- [ ] **Flujo de edición de productos con aprobación y preview**
  - Rol intermedio que puede proponer cambios a un producto (draft)
  - El admin revisa y aprueba o rechaza
  - Preview de cómo queda el producto antes de publicarlo a producción
  - Requiere modelo `ProductDraft` en el backend + lógica de roles nueva

- [ ] **Recuperar contraseña** (olvidé mi contraseña)
  - Requiere email transaccional → desbloquear después del punto de emails

- [ ] **Buscador de productos**
  - Búsqueda por nombre, tag o descripción
  - No existe ninguna búsqueda hoy

- [ ] **Filtros avanzados**
  - Por rango de precio, talla disponible, etc.
  - Hoy solo se puede filtrar por género o categoría

- [ ] **Múltiples direcciones guardadas**
  - `UserAddress` es 1:1 con User, solo puede haber una dirección
  - Cambiar a 1:N para que el usuario elija al hacer checkout

- [ ] **Número de seguimiento en envíos**
  - El estado `shipped` existe pero no hay campo para tracking number ni link al courier

- [ ] **Productos relacionados**
  - Sugerencias en el detalle del producto ("también te puede interesar")

### Baja prioridad — features avanzados

- [ ] **Dashboard de analytics para admin**
  - Ventas por período, productos más vendidos, ingresos totales

- [ ] **Sistema de cupones y descuentos**
  - El modelo `Order` no tiene campo de descuento

- [ ] **Wishlist / Favoritos**

- [ ] **Reviews y calificaciones de productos**

- [ ] **SEO**
  - Metadata dinámica por producto
  - Structured data `application/ld+json`
  - Open Graph para compartir en redes

- [ ] **Notificaciones al admin**
  - Alerta cuando llega una orden nueva

- [ ] **PWA / notificaciones push**

---

## Orden sugerido de implementación

| # | Feature | Motivo |
|---|---------|--------|
| 1 | ~~Subida de comprobante de transferencia~~ | ✅ Completado |
| 2 | ~~Descuento de stock al pagar~~ | ✅ Completado |
| 3 | ~~Emails transaccionales~~ | ✅ Completado |
| 4 | API de envíos | Costo de envío real en checkout |
| 5 | Flujo de edición con aprobación y preview | Más complejo, requiere trabajo en backend también |
| 6 | Buscador + filtros avanzados | UX de shop |
| 7 | Recuperar contraseña | Necesario antes de ir a producción con usuarios reales |
| 8 | SEO | Antes de publicar a producción |

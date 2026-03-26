# Spec: White-Label System & Branding Engine

## 1. Contexto del Negocio
Transformar el e-commerce actual en un producto de "Marca Blanca" (SaaS). El sistema debe permitir que distintos clientes (vendedores) personalicen la identidad visual y la lógica de negocio sin modificar el código fuente.

## 2. Definición Técnica (Branding Engine)
El sistema utiliza un enfoque de **Inyección Dinámica de Estilos** en el servidor para evitar parpadeos visuales (FOUC).

### A. Fuente de Datos
- **Tabla Prisma**: `StoreConfig`
- **Campos Críticos**: 
    - `primaryColor`, `secondaryColor` (Hexadecimales)
    - `logoUrl` (Cloudinary)
    - `name` (SEO & Navbar)

### B. Mecanismo de Estilo (CSS Variables)
Tailwind CSS está configurado para consumir variables CSS (`--primary`, `--secondary`).
- El componente `ThemeInjector` (Server Component) lee la base de datos y renderiza un bloque `<style>` en el `<head>` del documento.

## 3. Arquitectura de Implementación

### Fase 1: Data Access (Completado)
- **Action**: `getStoreConfig` en `src/actions/config/get-store-config.ts`.
- **Propósito**: Recuperar el primer (y por ahora único) registro de configuración.

### Fase 2: Inyección en Layout (Pendiente)
- Integrar el fetch de configuración en el `RootLayout` (`src/app/layout.tsx`).
- Inyectar dinámicamente:
    - Favicon y Título de la página.
    - Bloque de estilos CSS.

### Fase 3: Componentes Adaptativos (Pendiente)
- **Navbar**: Debe mostrar el logo dinámico o el nombre de la tienda si el logo no existe.
- **Footer**: Información de contacto dinámica.
- **Botones**: Deben usar exclusivamente las clases `.btn-primary` y `.btn-secondary` definidas en `globals.css`.

## 4. Métodos de Pago & Envíos (White Label)
- **Mercado Pago**: El `public_key` y `access_token` deberán ser configurables por tienda (futuro).
- **Transferencia**: Mostrar datos bancarios (`bankName`, `bankCbu`, etc.) solo si el método `transfer` está activo en la orden.
- **Envíos**: Mostrar el campo `shippingInfo` personalizado en el detalle de la compra.

## 5. Reglas de Desarrollo
1. **Prohibido el Hardcoding**: No usar colores hexadecimales en los archivos `.tsx`. Usar clases de Tailwind o variables CSS.
2. **Server First**: La configuración de la tienda debe resolverse en el servidor para optimizar el SEO y el rendimiento.
3. **Fallback**: Siempre debe haber un valor por defecto (branding base) si la base de datos está vacía.
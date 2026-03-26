import { getStoreConfig } from '@/actions/config/get-store-config';

/**
 * ThemeInjector - Server Component
 *
 * Inyecta las variables CSS dinámicas (--primary, --secondary)
 * en el <head> del documento para evitar FOUC (Flash of Unstyled Content).
 *
 * Se renderiza en el servidor, garantizando que los estilos estén
 * disponibles en el primer renderizado.
 */
export async function ThemeInjector() {
  const result = await getStoreConfig();

  if (!result.ok || !result.config) {
    // Fallback: usar colores por defecto definidos en globals.css
    return null;
  }

  const { primaryColor, secondaryColor } = result.config;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary: ${primaryColor};
            --secondary: ${secondaryColor};
          }
        `,
      }}
    />
  );
}

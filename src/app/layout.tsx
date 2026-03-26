import type { Metadata } from "next";
import { inter } from "@/config/fonts";

import "./globals.css";
import { Providers } from "@/components";
import { ThemeInjector } from "@/components/theme/ThemeInjector";
import { getStoreConfig } from "@/actions/config/get-store-config";

/**
 * Metadata Dinámica
 * Se genera en el servidor usando la configuración de la tienda
 */
export async function generateMetadata(): Promise<Metadata> {
  const result = await getStoreConfig();
  const storeName = result.config?.name || "Teslo | Shop";

  return {
    title: {
      template: `%s - ${storeName}`,
      default: `Home - ${storeName}`,
    },
    description: "Una tienda virtual de productos",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ThemeInjector />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

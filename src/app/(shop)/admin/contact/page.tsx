import { getStoreConfig } from '@/actions';
import { ContactConfigForm } from './ui/ContactConfigForm';

export default async function AdminContactPage() {
  const { config } = await getStoreConfig();

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Página de Contacto</h1>
      <p className="text-gray-500 mb-8">
        Completá los datos del local. Cuando estés listo, activá la opción de publicar para mostrar el link en el navbar.
      </p>

      <ContactConfigForm config={config} />
    </div>
  );
}

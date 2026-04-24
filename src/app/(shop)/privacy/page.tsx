import { Title } from '@/components';
import { STORE_NAME } from '@/config/store';

export const metadata = {
  title: 'Política de Privacidad',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Title title="Política de Privacidad" />

      <div className="prose prose-sm text-gray-700 space-y-6">

        <p className="text-sm text-gray-500">Última actualización: abril de 2026</p>

        <section>
          <h2 className="text-lg font-semibold mb-2">1. Responsable del tratamiento</h2>
          <p>
            <strong>{STORE_NAME}</strong> es el responsable del tratamiento de los datos personales recolectados
            a través de este sitio web, en cumplimiento de la <strong>Ley 25.326 de Protección de Datos Personales</strong> de la República Argentina.
          </p>
          <p className="mt-2">
            Contacto: <a href="mailto:contacto@costumbresargentinas.com" className="text-blue-600 underline">contacto@costumbresargentinas.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Datos que recolectamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Datos de registro:</strong> nombre, apellido, dirección de email y contraseña.</li>
            <li><strong>Datos de envío:</strong> dirección postal, ciudad, código postal, teléfono de contacto.</li>
            <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas (con fines estadísticos y de seguridad).</li>
            <li><strong>Datos de pago:</strong> procesados íntegramente por MercadoPago o transferencia bancaria; no almacenamos datos de tarjetas.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Finalidad del tratamiento</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestionar tu cuenta y el proceso de compra.</li>
            <li>Procesar y hacer seguimiento de tus pedidos.</li>
            <li>Enviarte confirmaciones de compra y actualizaciones de estado.</li>
            <li>Mejorar la experiencia del sitio web.</li>
            <li>Cumplir con obligaciones legales y fiscales.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Base legal</h2>
          <p>
            El tratamiento de tus datos se basa en la ejecución del contrato de compraventa, tu consentimiento
            y el cumplimiento de obligaciones legales aplicables en Argentina.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Conservación de datos</h2>
          <p>
            Conservamos tus datos mientras mantengas una cuenta activa y por el tiempo que exijan las
            obligaciones legales y contables aplicables (mínimo 10 años para documentación fiscal según la
            legislación argentina).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Compartición de datos</h2>
          <p>No vendemos ni cedemos tus datos a terceros. Solo los compartimos con:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>MercadoPago</strong> — para procesar pagos con tarjeta o billetera virtual.</li>
            <li><strong>Empresas de logística</strong> — para coordinar el envío de tus pedidos.</li>
            <li><strong>Autoridades competentes</strong> — cuando lo exija la ley.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Tus derechos (ARCO)</h2>
          <p>
            Conforme a la Ley 25.326 podés ejercer los derechos de <strong>Acceso, Rectificación,
            Cancelación y Oposición</strong> escribiendo a{' '}
            <a href="mailto:contacto@costumbresargentinas.com" className="text-blue-600 underline">
              contacto@costumbresargentinas.com
            </a>. Respondemos en un plazo máximo de 5 días hábiles.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            La Dirección Nacional de Protección de Datos Personales (DNPDP) es el organismo competente para
            recibir denuncias: <a href="https://www.argentina.gob.ar/aaip/datospersonales" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.argentina.gob.ar/aaip</a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. Seguridad</h2>
          <p>
            Aplicamos medidas técnicas y organizativas razonables (HTTPS, cifrado en tránsito, acceso
            restringido a datos) para proteger tu información contra acceso no autorizado, pérdida o alteración.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">9. Cookies</h2>
          <p>
            Utilizamos cookies de sesión necesarias para el funcionamiento del carrito y la autenticación.
            No utilizamos cookies de seguimiento publicitario de terceros.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">10. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política en cualquier momento. Los cambios significativos serán notificados
            por email o mediante un aviso destacado en el sitio.
          </p>
        </section>

      </div>
    </div>
  );
}

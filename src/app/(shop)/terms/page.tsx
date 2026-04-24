import { Title } from '@/components';
import { STORE_NAME } from '@/config/store';

export const metadata = {
  title: 'Términos y Condiciones',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Title title="Términos y Condiciones" />

      <div className="prose prose-sm text-gray-700 space-y-6">

        <p className="text-sm text-gray-500">Última actualización: abril de 2026</p>

        <section>
          <h2 className="text-lg font-semibold mb-2">1. Aceptación</h2>
          <p>
            Al realizar una compra o crear una cuenta en <strong>{STORE_NAME}</strong> aceptás estos Términos
            y Condiciones en su totalidad. Si no estás de acuerdo, por favor no utilices el sitio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. Productos y disponibilidad</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Los precios publicados incluyen IVA y están expresados en pesos argentinos (ARS), salvo indicación contraria.</li>
            <li>Nos reservamos el derecho de modificar precios sin previo aviso.</li>
            <li>El stock mostrado es orientativo; en caso de quiebre de stock te contactaremos para ofrecerte una alternativa o reintegro.</li>
            <li>Las imágenes de los productos son ilustrativas; pueden existir leves variaciones de color o textura.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Proceso de compra</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Seleccionás los productos y los agregás al carrito.</li>
            <li>Completás los datos de envío.</li>
            <li>Elegís el método de pago (MercadoPago o transferencia bancaria).</li>
            <li>Confirmás el pedido y recibís un email de confirmación.</li>
          </ol>
          <p className="mt-2">
            El contrato de compraventa queda perfeccionado una vez que acreditamos el pago.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Métodos de pago</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>MercadoPago:</strong> tarjeta de crédito/débito o billetera virtual. El procesamiento
              lo realiza MercadoPago; sus términos aplican adicionalmente.
            </li>
            <li>
              <strong>Transferencia bancaria:</strong> realizás la transferencia y subís el comprobante en
              tu pedido. El pedido se procesa una vez verificado el acreditación (hasta 24 h hábiles).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. Envíos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Los plazos de entrega son estimativos y pueden variar por causas ajenas a nosotros (operadores logísticos, feriados, etc.).</li>
            <li>Los costos de envío se calculan en el checkout según el destino.</li>
            <li>El riesgo de pérdida o daño se transfiere al comprador una vez entregado el paquete al transportista.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. Devoluciones y cambios</h2>
          <p>
            Conforme a la <strong>Ley 24.240 de Defensa del Consumidor</strong>, tenés <strong>10 días corridos</strong> desde
            la recepción del producto para ejercer el derecho de arrepentimiento, sin necesidad de
            justificación y sin costo a tu cargo, siempre que el producto se encuentre en su estado
            original y con embalaje intacto.
          </p>
          <p className="mt-2">
            Para iniciar una devolución escribinos a{' '}
            <a href="mailto:contacto@costumbresargentinas.com" className="text-blue-600 underline">
              contacto@costumbresargentinas.com
            </a>{' '}
            indicando tu número de pedido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. Garantía</h2>
          <p>
            Todos los productos cuentan con la garantía legal mínima de <strong>3 meses</strong> contra
            defectos de fabricación, conforme a la Ley 24.240. Para productos nuevos con garantía del
            fabricante, el plazo indicado en el packaging aplica adicionalmente.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">8. Responsabilidad</h2>
          <p>
            {STORE_NAME} no será responsable por daños indirectos, lucro cesante o daños derivados del
            uso incorrecto de los productos. Nuestra responsabilidad máxima queda limitada al valor del
            producto adquirido.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">9. Propiedad intelectual</h2>
          <p>
            Todos los contenidos del sitio (textos, imágenes, logotipos, diseño) son propiedad de{' '}
            {STORE_NAME} o de sus proveedores y están protegidos por las leyes argentinas de propiedad
            intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">10. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de la <strong>República Argentina</strong>. Ante cualquier
            controversia, las partes se someten a la jurisdicción de los tribunales ordinarios de la Ciudad
            Autónoma de Buenos Aires, renunciando a cualquier otro fuero que pudiera corresponderles.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">11. Contacto</h2>
          <p>
            Para consultas sobre estos términos:{' '}
            <a href="mailto:contacto@costumbresargentinas.com" className="text-blue-600 underline">
              contacto@costumbresargentinas.com
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}

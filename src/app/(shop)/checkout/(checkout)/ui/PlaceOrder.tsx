"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import type { PaymentMethod } from '@/interfaces';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, subTotal, tax, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);

    const productsToOrder = cart.map(product => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
      price: product.price,
    }));

    const resp = await placeOrder(productsToOrder, address, paymentMethod);
    if (!resp.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(resp.message);
      return;
    }

    clearCart();
    router.replace('/orders/' + resp.order?.id);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>
      <div className="mb-10">
        <p className="text-xl">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>{address.city}, Argentina</p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total:</span>
        <span className="mt-5 text-2xl text-right">{currencyFormat(total)}</span>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 my-8" />

      {/* Método de pago */}
      <h2 className="text-2xl mb-4">Método de pago</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setPaymentMethod('mercadopago')}
          className={clsx(
            'flex flex-col items-center gap-1 p-4 rounded-lg border-2 transition-colors text-sm font-medium',
            paymentMethod === 'mercadopago'
              ? 'border-[#009ee3] bg-[#009ee3]/5 text-[#009ee3]'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          )}
        >
          <span className="text-2xl">💳</span>
          MercadoPago
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod('transfer')}
          className={clsx(
            'flex flex-col items-center gap-1 p-4 rounded-lg border-2 transition-colors text-sm font-medium',
            paymentMethod === 'transfer'
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-500 hover:border-gray-300'
          )}
        >
          <span className="text-2xl">🏦</span>
          Transferencia
        </button>
      </div>

      {paymentMethod === 'transfer' && (
        <p className="text-sm text-gray-500 mb-4 bg-blue-50 border border-blue-100 rounded-lg p-3">
          Al confirmar la orden recibirás los datos bancarios para realizar la transferencia.
          Luego podrás subir el comprobante desde el detalle de tu orden.
        </p>
      )}

      <p className="mb-5">
        <span className="text-xs">
          Al hacer clic en &quot;Colocar orden&quot;, aceptas nuestros{" "}
          <a href="#" className="underline">términos y condiciones</a>{" "}
          y{" "}
          <a href="#" className="underline">política de privacidad</a>
        </span>
      </p>

      <p className="text-red-500">{errorMessage}</p>

      <button
        onClick={onPlaceOrder}
        className={clsx({
          'btn-primary': !isPlacingOrder,
          'btn-disabled': isPlacingOrder,
        })}
      >
        Colocar orden
      </button>
    </div>
  );
};

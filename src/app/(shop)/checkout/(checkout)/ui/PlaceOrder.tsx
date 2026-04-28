"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder, verifyCartProducts } from '@/actions';
import type { PriceChangeIssue, StockIssue } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import type { PaymentMethod } from '@/interfaces';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [priceWarning, setPriceWarning] = useState<PriceChangeIssue[]>([]);
  const [stockErrors, setStockErrors] = useState<StockIssue[]>([]);

  const address = useAddressStore((state) => state.address);

  const { itemsInCart, total } = useCartStore((state) =>
    state.getSummaryInformation()
  );
  const cart = useCartStore(state => state.cart);
  const clearCart = useCartStore(state => state.clearCart);
  const updateCartPrices = useCartStore(state => state.updateCartPrices);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage('');

    const cartItems = cart.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
    }));

    const verification = await verifyCartProducts(cartItems);

    if (verification.stockIssues.length > 0) {
      setStockErrors(verification.stockIssues);
      setPriceWarning([]);
      setIsPlacingOrder(false);
      return;
    }

    if (verification.priceChanges.length > 0) {
      const priceMap = Object.fromEntries(
        verification.priceChanges.map(c => [c.productId, c.newPrice])
      );
      updateCartPrices(priceMap);
      setPriceWarning(verification.priceChanges);
      setStockErrors([]);
      setIsPlacingOrder(false);
      return;
    }

    setPriceWarning([]);
    setStockErrors([]);

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

  const hasStockBlocker = stockErrors.length > 0;
  const buttonLabel = priceWarning.length > 0
    ? 'Confirmar con nuevos precios'
    : 'Colocar orden';

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

      {/* Stock error */}
      {stockErrors.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <p className="font-semibold mb-1">Sin stock disponible</p>
          <ul className="list-disc list-inside space-y-0.5">
            {stockErrors.map(e => (
              <li key={e.productId}>
                <span className="font-medium">{e.title}</span>:{' '}
                {e.available === 0
                  ? 'sin stock'
                  : `quedan ${e.available} unidad${e.available !== 1 ? 'es' : ''}`}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">Modificá tu carrito para continuar.</p>
        </div>
      )}

      {/* Price change warning */}
      {priceWarning.length > 0 && (
        <div className="mb-4 p-4 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800">
          <p className="font-semibold mb-1">Se actualizaron precios</p>
          <ul className="list-disc list-inside space-y-0.5">
            {priceWarning.map(c => (
              <li key={c.productId}>
                <span className="font-medium">{c.title}</span>:{' '}
                {currencyFormat(c.oldPrice)} → {currencyFormat(c.newPrice)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            Por favor revisá el nuevo total antes de confirmar tu orden.
          </p>
        </div>
      )}

      <p className="text-red-500">{errorMessage}</p>

      <button
        onClick={onPlaceOrder}
        disabled={isPlacingOrder || hasStockBlocker}
        className={clsx({
          'btn-primary': !isPlacingOrder && !hasStockBlocker,
          'btn-disabled': isPlacingOrder || hasStockBlocker,
        })}
      >
        {isPlacingOrder ? 'Procesando...' : buttonLabel}
      </button>
    </div>
  );
};

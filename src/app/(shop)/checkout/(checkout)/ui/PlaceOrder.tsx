"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { placeOrder, verifyCartProducts } from '@/actions';
import type { PriceChangeIssue, StockIssue } from '@/actions';
import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat } from '@/utils';
import type { PaymentMethod } from '@/interfaces';
import { getShippingQuotes } from '@/actions/shipping/get-shipping-quotes';
import type { ShippingQuote } from '@/interfaces/shipping.interface';
import Link from 'next/link';

export const PlaceOrder = () => {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mercadopago');
  const [quoteState, setQuoteState] = useState<{ key: string; quote: ShippingQuote } | null>(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [quoteError, setQuoteError] = useState('');
  const [quoting, setQuoting] = useState(false);
  const [retry, setRetry] = useState(0);
  const [expired, setExpired] = useState(false);
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

  const requestKey = JSON.stringify({
    items: cart.map((item) => ({ productId: item.id, variantId: item.variantId, size: item.size, quantity: item.quantity })),
    destination: { city: address.city ?? '', province: address.province ?? '', postalCode: address.postalCode ?? '' },
    prices: cart.map((item) => item.price),
  });
  const quote = quoteState?.key === requestKey ? quoteState.quote : null;
  const selected = quote?.options.find((option) => option.key === selectedKey);
  const canOrder = !!selected && !expired && !quoting && !isPlacingOrder;
  const shippingCost = selected?.price;
  const subtotal = quote?.subtotal ?? total;
  const estimatedTotal = shippingCost === undefined ? null : Math.round((subtotal + shippingCost) * 100) / 100;

  useEffect(() => {
    if (!loaded) return;
    let cancelled = false;
    setQuoteState(null);
    setSelectedKey('');
    setQuoteError('');
    setExpired(false);
    setQuoting(true);
    const timeout = setTimeout(async () => {
      try {
        const { items, destination } = JSON.parse(requestKey);
        if (!items.length || !destination.city.trim() || !destination.province.trim() || !destination.postalCode.trim()) {
          if (!cancelled) setQuoteError('Completá ciudad, provincia y código postal y agregá productos al carrito.');
          return;
        }
        const result = await getShippingQuotes({ items, destination });
        if (cancelled) return;
        if (!result.ok) setQuoteError(result.message);
          else {
            setQuoteState({ key: requestKey, quote: result.quote });
            setStockErrors([]);
          if (!result.quote.options.length) setQuoteError('No encontramos envíos disponibles para este destino. Revisá la dirección o contactanos.');
        }
      } catch {
        if (!cancelled) setQuoteError('No pudimos calcular el envío. Volvé a intentar.');
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, 400);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [loaded, requestKey, retry]);

  useEffect(() => {
    if (!quote) return;
    const timeout = setTimeout(() => setExpired(true), Math.max(0, quote.expiresAt - Date.now()));
    return () => clearTimeout(timeout);
  }, [quote]);

  const onPlaceOrder = async () => {
    if (!canOrder || !selected) return;
    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
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
        ...(product.size ? { size: product.size } : {}),
        price: product.price,
        ...(product.variantId ? { variantId: product.variantId } : {}),
      }));
  
      const resp = await placeOrder(productsToOrder, address, paymentMethod, selected.serviceCode === 'pickup_point' ? 'sucursal' : 'domicilio', selected.token);
      if (!resp.ok) {
        setIsPlacingOrder(false);
        setErrorMessage(resp.message);
        setSelectedKey('');
        setRetry((value) => value + 1);
        return;
      }
  
      clearCart();
      router.replace('/orders/' + resp.order?.id);
    } catch {
      setErrorMessage('No pudimos confirmar el pedido. Revisá la conexión y volvé a intentar.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  const hasStockBlocker = stockErrors.length > 0;
  const buttonLabel = priceWarning.length > 0
    ? 'Confirmar con nuevos precios'
    : 'Realizar orden';

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
        <p>{address.city}{address.province ? `, ${address.province}` : ''}, Argentina</p>
        <p>{address.phone}</p>
      </div>

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-4">Elegí tu envío</h2>
      <Link href="/checkout/address" className="mb-4 inline-block text-sm text-primary underline">Cambiar dirección</Link>
      {quoting && <p role="status" className="mb-4 text-sm text-gray-600">Consultando precios de envío…</p>}
      {quoteError && <p role="alert" className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{quoteError}</p>}
      {expired && <p role="alert" className="mb-4 text-sm text-amber-800">La cotización venció. Actualizá los precios para continuar.</p>}
      <fieldset disabled={isPlacingOrder || quoting || expired} className="mb-4 space-y-3 disabled:opacity-60">
        <legend className="sr-only">Transportista y lugar de entrega</legend>
        {quote?.options.map((option) => (
          <label key={option.key} className={clsx('flex cursor-pointer items-start gap-3 rounded-xl border p-4', selectedKey === option.key ? 'border-primary bg-primary/5' : 'border-gray-200')}>
            <input type="radio" name="shipping-option" value={option.key} checked={selectedKey === option.key} onChange={() => setSelectedKey(option.key)} className="mt-1 accent-primary" />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap justify-between gap-2 font-semibold"><span>{option.carrierName}</span><span>{currencyFormat(option.price)}</span></span>
              <span className="mt-1 block text-sm">{option.serviceCode === 'pickup_point' ? 'Retiro en punto de entrega' : 'Entrega a domicilio'}</span>
              {option.pickupPoint && <span className="mt-1 block text-sm text-gray-600">{option.pickupPoint.name}<br />{option.pickupPoint.address}</span>}
              {option.estimatedDelivery && !Number.isNaN(Date.parse(option.estimatedDelivery)) && <span className="mt-2 block text-xs text-gray-500">Entrega estimada: {new Date(option.estimatedDelivery).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</span>}
            </span>
          </label>
        ))}
      </fieldset>
      <button type="button" disabled={quoting || isPlacingOrder} onClick={() => { setSelectedKey(''); setRetry((value) => value + 1); }} className="mb-6 text-sm text-primary underline disabled:opacity-50">Volver a calcular envío</button>
      {!selected && !quoting && !!quote?.options.length && <p className="mb-4 text-sm text-gray-600">Seleccioná una opción para confirmar el total.</p>}

      <h2 className="text-2xl mb-2">Resumen de orden</h2>

      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsInCart === 1 ? "1 artículo" : `${itemsInCart} artículos`}
        </span>

        <span className="mt-2">Subtotal:</span>
        <span className="mt-2 text-right">{currencyFormat(subtotal)}</span>

        <span className="mt-2">Envío:</span>
        <span className="mt-2 text-right">
          {shippingCost === undefined ? 'A seleccionar' : currencyFormat(shippingCost)}
        </span>

        <span className="mt-5 text-2xl font-semibold">Total:</span>
        <span className="mt-5 text-2xl text-right font-semibold">{estimatedTotal === null ? 'A confirmar' : currencyFormat(estimatedTotal)}</span>
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
          Al hacer clic en &quot;Realizar orden&quot;, aceptas nuestros{" "}
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
        disabled={!canOrder || hasStockBlocker}
        className={clsx({
          'btn-primary': canOrder && !hasStockBlocker,
          'btn-disabled': !canOrder || hasStockBlocker,
        })}
      >
        {isPlacingOrder ? 'Procesando...' : buttonLabel}
      </button>
    </div>
  );
};

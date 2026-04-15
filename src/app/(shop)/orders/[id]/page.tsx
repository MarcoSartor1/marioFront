import { redirect } from "next/navigation";
import Image from "next/image";

import { getOrderById, getStoreConfig } from "@/actions";
import { currencyFormat } from "@/utils";
import { MercadoPagoButton, OrderStatus, Title, TransferPaymentSection } from "@/components";
import type { Order } from "@/interfaces";

interface Props {
  params: {
    id: string;
  };
}

export default async function OrdersByIdPage({ params }: Props) {
  const { id } = params;

  const [{ ok, order }, { config }] = await Promise.all([
    getOrderById(id),
    getStoreConfig(),
  ]);

  if (!ok) {
    redirect("/");
  }

  const o = order as Order;
  const address = o.address;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id.split("-").at(-1)}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Productos */}
          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={o.isPaid} />

            {o.items.map((item) => (
              <div
                key={item.productId + "-" + item.size}
                className="flex mb-5"
              >
                <Image
                  src={(() => {
                    const url = item.product?.images?.[0]?.url;
                    if (!url) return '/imgs/placeholder.jpg';
                    return url.startsWith('http') ? url : `${process.env.API_URL}/files/product/${url}`;
                  })()}
                  width={100}
                  height={100}
                  style={{ width: "100px", height: "100px" }}
                  alt={item.product?.title ?? "Producto"}
                  className="mr-5 rounded"
                />
                <div>
                  <p>{item.product?.title}</p>
                  <p>${item.price} x {item.quantity}</p>
                  <p className="font-bold">
                    Subtotal: {currencyFormat(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen y pago */}
          <div className="bg-white rounded-xl shadow-xl p-7">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>
            <div className="mb-10">
              <p className="text-xl">
                {address?.firstName} {address?.lastName}
              </p>
              <p>{address?.address}</p>
              <p>{address?.address2}</p>
              <p>{address?.postalCode}</p>
              <p>{address?.city}, Argentina</p>
              <p>{address?.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {o.itemsInOrder === 1 ? "1 artículo" : `${o.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">{currencyFormat(o.subTotal)}</span>

              <span>Impuestos (21%)</span>
              <span className="text-right">{currencyFormat(o.tax)}</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{currencyFormat(o.total)}</span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {o.isPaid ? (
                <OrderStatus isPaid={true} />
              ) : o.paymentMethod === 'transfer' ? (
                <TransferPaymentSection
                  orderId={o.id}
                  paymentReceipt={o.paymentReceipt}
                  bank={{
                    bankName: config.bankName,
                    bankOwnerName: config.bankOwnerName,
                    bankCbu: config.bankCbu,
                    bankAlias: config.bankAlias,
                    bankAccount: config.bankAccount,
                    bankAccountType: config.bankAccountType,
                  }}
                />
              ) : (
                <MercadoPagoButton orderId={o.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

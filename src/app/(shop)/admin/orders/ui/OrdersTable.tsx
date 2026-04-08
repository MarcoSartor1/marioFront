'use client';

import { useEffect, useRef, useState } from 'react';
import { AdminOrder, OrderStatus } from '@/interfaces';
import { updateOrderStatus } from '@/actions';
import { IoCardOutline, IoEllipsisVertical, IoClose, IoAlertCircleOutline } from 'react-icons/io5';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  paid: 'Pago confirmado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-700',
  processing: 'text-orange-600',
  paid: 'text-green-700',
  shipped: 'text-blue-700',
  delivered: 'text-indigo-700',
  cancelled: 'text-red-700',
};

const ALL_FILTER_STATUSES: OrderStatus[] = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'];
const ALL_UPDATE_STATUSES: OrderStatus[] = ['pending', 'processing', 'paid', 'shipped', 'delivered', 'cancelled'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface Props {
  orders: AdminOrder[];
}

export function OrdersTable({ orders: initialOrders }: Props) {
  const [orders, setOrders] = useState<AdminOrder[]>(initialOrders);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  // Menú tres puntos
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modal ver orden (productos)
  const [viewOrder, setViewOrder] = useState<AdminOrder | null>(null);

  // Modal actualizar estado
  const [updateOrder, setUpdateOrder] = useState<AdminOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('pending');

  // Modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filtered =
    statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter);

  // Cierra menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function openUpdateModal(order: AdminOrder) {
    setUpdateOrder(order);
    setSelectedStatus(order.status);
    setErrorMsg(null);
    setOpenMenuId(null);
  }

  function handleUpdateContinue() {
    if (!updateOrder || selectedStatus === updateOrder.status) return;
    setConfirmOpen(true);
  }

  async function handleConfirm() {
    if (!updateOrder) return;
    setUpdating(true);
    setErrorMsg(null);

    const { ok, message } = await updateOrderStatus(updateOrder.id, selectedStatus);

    if (!ok) {
      setErrorMsg(message ?? 'Error desconocido');
      setUpdating(false);
      return;
    }

    // Actualizar estado local
    setOrders((prev) =>
      prev.map((o) =>
        o.id === updateOrder.id ? { ...o, status: selectedStatus } : o
      )
    );

    setUpdating(false);
    setConfirmOpen(false);
    setUpdateOrder(null);
  }

  return (
    <>
      {/* Filtro de estado */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            statusFilter === 'all'
              ? 'bg-gray-800 text-white border-gray-800'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Todos
        </button>
        {ALL_FILTER_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-sm border transition-colors ${
              statusFilter === s
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">#ID</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Nombre completo</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Estado</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Fecha</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                No hay órdenes para este estado.
              </td>
            </tr>
          )}
          {filtered.map((order) => (
            <tr
              key={order.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id.split('-').at(-1)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {order.fullName}
              </td>
              <td className="text-sm font-light px-6 py-4 whitespace-nowrap">
                <div className={`flex items-center gap-1 ${STATUS_COLORS[order.status]}`}>
                  <IoCardOutline />
                  <span>{STATUS_LABELS[order.status]}</span>
                </div>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {formatDate(order.createdAt)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap relative">
                <div
                  ref={openMenuId === order.id ? menuRef : undefined}
                  className="relative inline-block"
                >
                  <button
                    onClick={() => setOpenMenuId(openMenuId === order.id ? null : order.id)}
                    className="p-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    <IoEllipsisVertical size={18} />
                  </button>

                  {openMenuId === order.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded shadow-lg z-10 flex flex-col">
                      <button
                        onClick={() => {
                          setViewOrder(order);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Ver orden
                      </button>
                      <button
                        onClick={() => openUpdateModal(order)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Actualizar estado
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Modal: Ver orden (productos) ── */}
      {viewOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setViewOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Orden #{viewOrder.id.split('-').at(-1)}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {viewOrder.fullName} · {viewOrder.email}
                </p>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-gray-700">Producto</th>
                    <th className="text-center py-2 font-medium text-gray-700">Talla</th>
                    <th className="text-center py-2 font-medium text-gray-700">Cant.</th>
                    <th className="text-right py-2 font-medium text-gray-700">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {viewOrder.products.map((p, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2 text-gray-800">{p.title}</td>
                      <td className="py-2 text-center text-gray-600">{p.size ?? '—'}</td>
                      <td className="py-2 text-center text-gray-600">{p.quantity}</td>
                      <td className="py-2 text-right text-gray-800">${p.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Estado:{' '}
                <span className={`font-medium ${STATUS_COLORS[viewOrder.status]}`}>
                  {STATUS_LABELS[viewOrder.status]}
                </span>
              </span>
              <span className="text-sm font-semibold text-gray-900">
                Total: $
                {viewOrder.products
                  .reduce((sum, p) => sum + p.price * p.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Actualizar estado ── */}
      {updateOrder && !confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setUpdateOrder(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-base font-semibold text-gray-900">Actualizar estado</h2>
              <button
                onClick={() => setUpdateOrder(null)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <IoClose size={20} />
              </button>
            </div>

            <div className="px-6 py-5">
              <p className="text-sm text-gray-500 mb-1">
                Orden #{updateOrder.id.split('-').at(-1)} · {updateOrder.fullName}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Estado actual:{' '}
                <span className={`font-medium ${STATUS_COLORS[updateOrder.status]}`}>
                  {STATUS_LABELS[updateOrder.status]}
                </span>
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nuevo estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                {ALL_UPDATE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setUpdateOrder(null)}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateContinue}
                disabled={selectedStatus === updateOrder.status}
                className="px-4 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Confirmación ── */}
      {confirmOpen && updateOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
            <div className="px-6 py-5 flex flex-col items-center text-center gap-3">
              <IoAlertCircleOutline size={48} className="text-yellow-500" />
              <h2 className="text-base font-semibold text-gray-900">¿Estás seguro?</h2>
              <p className="text-sm text-gray-600">
                Vas a cambiar el estado de la orden{' '}
                <span className="font-medium">#{updateOrder.id.split('-').at(-1)}</span> de{' '}
                <span className={`font-medium ${STATUS_COLORS[updateOrder.status]}`}>
                  {STATUS_LABELS[updateOrder.status]}
                </span>{' '}
                a{' '}
                <span className={`font-medium ${STATUS_COLORS[selectedStatus]}`}>
                  {STATUS_LABELS[selectedStatus]}
                </span>
                .
              </p>
              {errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded w-full">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setConfirmOpen(false)}
                disabled={updating}
                className="px-4 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={updating}
                className="px-4 py-2 text-sm rounded bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {updating ? 'Actualizando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

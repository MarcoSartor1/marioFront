'use client';

import { useRef, useState } from 'react';
import { uploadPaymentReceipt } from '@/actions';

interface BankData {
  bankName: string | null;
  bankOwnerName: string | null;
  bankCbu: string | null;
  bankAlias: string | null;
  bankAccount: string | null;
  bankAccountType: string | null;
}

interface Props {
  orderId: string;
  paymentReceipt: string | null;
  bank: BankData;
}

export const TransferPaymentSection = ({ orderId, paymentReceipt: initialReceipt, bank }: Props) => {
  const [receipt, setReceipt] = useState<string | null>(initialReceipt);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  if (receipt) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
        <p className="text-blue-700 font-medium">Comprobante enviado</p>
        <p className="text-sm text-blue-600 mt-1">
          Estamos verificando tu pago. Te avisaremos cuando esté confirmado.
        </p>
        <a
          href={receipt}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-blue-500 underline"
        >
          Ver comprobante subido
        </a>
      </div>
    );
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setError('Solo se aceptan imágenes JPG, PNG o PDF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede superar los 5MB.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('receipt', file);

    const result = await uploadPaymentReceipt(orderId, formData);
    setUploading(false);

    if (!result.ok) {
      setError(result.message ?? 'Error al subir el comprobante.');
      return;
    }

    setReceipt(result.paymentReceipt ?? null);
  };

  return (
    <div className="space-y-4">
      {/* Datos bancarios */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
        <p className="font-semibold text-gray-800 mb-3">Datos para la transferencia</p>

        {bank.bankName && (
          <Row label="Banco" value={bank.bankName} />
        )}
        {bank.bankOwnerName && (
          <Row label="Titular" value={bank.bankOwnerName} />
        )}
        {bank.bankAccountType && bank.bankAccount && (
          <Row label={bank.bankAccountType} value={bank.bankAccount} />
        )}
        {bank.bankCbu && (
          <CopyRow label="CBU" value={bank.bankCbu} />
        )}
        {bank.bankAlias && (
          <CopyRow label="Alias" value={bank.bankAlias} />
        )}
      </div>

      {/* Upload comprobante */}
      <div>
        <p className="text-sm text-gray-600 mb-3">
          Una vez realizada la transferencia, subí el comprobante para que podamos confirmar tu pago.
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-2">{error}</p>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          className="hidden"
          onChange={handleUpload}
        />

        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {uploading ? 'Subiendo comprobante...' : '📎 Subir comprobante de pago'}
        </button>
      </div>
    </div>
  );
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <button
        onClick={copy}
        className="font-mono font-medium text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1"
      >
        {value}
        <span className="text-xs text-gray-400 ml-1">{copied ? '✓' : 'copiar'}</span>
      </button>
    </div>
  );
}

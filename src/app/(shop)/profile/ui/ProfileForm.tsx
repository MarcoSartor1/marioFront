'use client';

import { useState } from 'react';
import { updateProfile } from '@/actions';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const ProfileForm = ({ user }: Props) => {
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword && newPassword !== confirmPassword) {
      setStatus({ ok: false, message: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    if (newPassword && !currentPassword) {
      setStatus({ ok: false, message: 'Debes ingresar tu contraseña actual para cambiarla' });
      return;
    }

    const payload: Record<string, string> = {};

    if (name.trim() !== user.name) payload.name = name.trim();
    if (newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setStatus({ ok: false, message: 'No hay cambios para guardar' });
      return;
    }

    setLoading(true);
    const result = await updateProfile(payload);
    setLoading(false);

    setStatus(result);
    if (result.ok) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const isAdmin = user.role === 'admin';

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">

      {/* Email — solo lectura */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded text-gray-500 cursor-not-allowed"
        />
      </div>

      {/* Role badge — solo si es admin */}
      {isAdmin && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Rol:</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Administrador
          </span>
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Cambiar contraseña */}
      <div className="border-t pt-5 space-y-4">
        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
          Cambiar contraseña <span className="font-normal text-gray-400">(opcional)</span>
        </p>

        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={6}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Feedback */}
      {status && (
        <p className={`text-sm ${status.ok ? 'text-green-600' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className={loading ? 'btn-disabled w-full' : 'btn-primary w-full'}
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
};

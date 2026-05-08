import { Suspense } from 'react';
import { titleFont } from '@/config/fonts';
import { VerifyEmailContent } from './ui/VerifyEmailContent';

export default function VerifyEmailPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Verificación de email</h1>
      <Suspense fallback={ <p className="text-gray-600">Cargando...</p> }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

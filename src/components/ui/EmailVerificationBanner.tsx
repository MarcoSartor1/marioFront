import { auth } from '@/auth.config';
import { ResendVerificationButton } from './ResendVerificationButton';

export async function EmailVerificationBanner() {
  const session = await auth();
  const user = session?.user as any;

  if ( !user || user.emailVerified ) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center text-sm text-yellow-800">
      Verificá tu email para no perder acceso a tu cuenta.{' '}
      <ResendVerificationButton />
    </div>
  );
}

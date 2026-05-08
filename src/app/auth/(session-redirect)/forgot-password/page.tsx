import { titleFont } from '@/config/fonts';
import { ForgotPasswordForm } from './ui/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Recuperar contraseña</h1>
      <ForgotPasswordForm />
    </div>
  );
}

import { auth } from '@/auth.config';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProfileForm } from './ui/ProfileForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const { id, name, email, role } = session.user as any;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Title title="Mi perfil" />
      <ProfileForm user={{ id, name, email, role }} />
    </div>
  );
}

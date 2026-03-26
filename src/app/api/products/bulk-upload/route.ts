import { auth } from '@/auth.config';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const session = await auth();
  const backendToken = (session?.user as any)?.token as string | undefined;

  if (!backendToken) {
    return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  }

  const formData = await request.formData();

  const resp = await fetch(`${process.env.API_URL}/products/bulk-upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${backendToken}`,
    },
    body: formData,
  });

  const data = await resp.json();

  return NextResponse.json(data, { status: resp.status });
}

import { getServerSession } from 'next-auth';
import { authOptions } from '@/configs/authOptions';
import { NextResponse } from 'next/server';

export async function handler(request) {
  const session = await getServerSession(authOptions);

  return NextResponse.json({
    authenticated: !!session,
    session,
  });
}

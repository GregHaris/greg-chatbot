import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { auth0Id, email, name } = await req.json();

      const user = await prisma.user.upsert({
        where: { auth0Id },
        update: { email, name },
        create: { auth0Id, email, name },
      });

      return NextResponse.json({ success: true, user });
    } catch (error) {
      console.error('Failed to create/update user:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to create/update user' },
        { status: 500 },
      );
    }
  } else {
    return NextResponse.json(
      { success: false, error: 'Method not allowed' },
      { status: 405 },
    );
  }
}

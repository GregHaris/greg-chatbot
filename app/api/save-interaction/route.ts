import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const { auth0Id, message, response } = await req.json();

      let user = await prisma.user.findUnique({
        where: { auth0Id },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            auth0Id,
            email: 'd.gregharis@gmail.com',
          },
        });
      }

      const interaction = await prisma.interaction.create({
        data: {
          userId: user.id,
          message,
          response,
        },
      });

      return NextResponse.json({ success: true, interaction });
    } catch (error) {
      console.error('Failed to save interaction:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save interaction' },
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

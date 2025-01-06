import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { auth0Id, message, response } = await req.json();

    if (!auth0Id || !message || !response) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Find or create the user in the database
    let user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          auth0Id,
          email: 'no-email@example.com',
        },
      });
    }

    // Save the interaction
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
}

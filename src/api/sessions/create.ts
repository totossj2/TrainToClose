import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.userId;

  // Ensure user is authenticated
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Create a new session using Clerk's userId directly
    const newSession = await prisma.session.create({
      data: {
        userId,
        title: 'New Session',
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Error creating session:', error);
    return new NextResponse('Error creating session', { status: 500 });
  }
}

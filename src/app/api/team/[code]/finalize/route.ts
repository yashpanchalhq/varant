import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { shastra } = await req.json();

    const session = await prisma.teamSession.update({
      where: { code },
      data: { 
        status: 'complete',
        shastra: JSON.stringify(shastra),
      },
    });

    // Log activity
    await prisma.teamMessage.create({
      data: {
        sessionId: session.id,
        memberName: 'System',
        content: 'Nirnaya rendered. Shastra is now permanent.',
        type: 'activity',
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Finalize Session Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

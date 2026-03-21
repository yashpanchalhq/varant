import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    await prisma.teamSession.update({
      where: { code },
      data: { status: 'active' },
    });

    // Log activity
    const session = await prisma.teamSession.findUnique({ where: { code } });
    if (session) {
      await prisma.teamMessage.create({
        data: {
          sessionId: session.id,
          memberName: 'System',
          content: 'Sabha entered Pratham Paksha',
          type: 'activity',
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

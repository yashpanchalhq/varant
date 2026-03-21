import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { memberName, content, type } = await req.json();

    const session = await prisma.teamSession.findUnique({
      where: { code },
    });

    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const message = await prisma.teamMessage.create({
      data: {
        sessionId: session.id,
        memberName,
        content,
        type,
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

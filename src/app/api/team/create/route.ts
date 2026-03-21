import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { decision, context } = await req.json();
    const code = 'SABHA-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const session = await prisma.teamSession.create({
      data: {
        code,
        decision,
        context: context || '',
        status: 'waiting',
        members: {
          create: {
            name: 'Host',
            role: 'Host',
            color: '#C17F24',
            isHost: true,
          }
        }
      },
    });

    return NextResponse.json({ code: session.code, sessionId: session.id });
  } catch (error) {
    console.error('Team Create Error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}

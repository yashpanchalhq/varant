import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const COLORS = ['#E53E3E', '#4A7C59', '#8B6914', '#2E5B8A', '#C17F24']

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const { name, role } = await req.json()

    const session = await prisma.teamSession.findUnique({
      where: { code },
      include: { members: true }
    })

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.members.length >= 5) {
      return NextResponse.json({ error: 'Session is full' }, { status: 400 })
    }

    const color = COLORS[session.members.length % COLORS.length]

    const member = await prisma.teamMember.create({
      data: {
        sessionId: session.id,
        name,
        role,
        color,
        isHost: false
      }
    })

    // Log activity
    await prisma.teamMessage.create({
      data: {
        sessionId: session.id,
        memberName: 'System',
        content: `${name} joined the Sabha`,
        type: 'activity',
      }
    })

    return NextResponse.json({ success: true, memberId: member.id, color })
  } catch (err) {
    console.error('Join API error:', err)
    return NextResponse.json({ error: 'Failed to join' }, { status: 500 })
  }
}

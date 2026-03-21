'use client'

import { use } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Member {
  id: string
  name: string
  role: string
  color: string
  isHost: boolean
}

export default function CreatedPage({
  params
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = use(params)
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [copied, setCopied] = useState(false)

  // Poll members every 3 seconds
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`/api/team/${code}/members`)
        if (res.ok) {
          const data = await res.json()
          // API returns the members array directly
          setMembers(Array.isArray(data) ? data : (data.members || []))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchMembers()
    const interval = setInterval(fetchMembers, 3000)
    return () => clearInterval(interval)
  }, [code])

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/team/join/${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleStart = async () => {
    try {
      const res = await fetch(`/api/team/${code}/start`, { method: "POST" });
      if (res.ok) {
        // Host enters session - update session storage with current host data
        const host = members.find(m => m.isHost);
        if (host) {
          sessionStorage.setItem(
            "Varant_team_member",
            JSON.stringify({
              id: host.id,
              name: host.name,
              role: host.role,
              color: host.color,
              isHost: true,
              code,
            }),
          );
        }
        router.push(`/team/session/${code}`);
      }
    } catch (error) {
      console.error("Start session failed", error);
    }
  };

  const canStart = members.length >= 2 // Host + 1 or more members

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FAF9F7',
      color: '#1A1510',
      fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
      WebkitFontSmoothing: 'antialiased',
      paddingTop: 120,
      paddingBottom: 80,
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
          fontSize: 10, letterSpacing: '0.25em',
          textTransform: 'uppercase', color: '#9B1C1C',
          marginBottom: 16,
          fontWeight: 600,
        }}>
          TEAM SABHA · SESSION CREATED
        </p>

        {/* Heading */}
        <h1 style={{
          fontFamily: "var(--font-cormorant), 'Cormorant', serif",
          fontWeight: 300, fontSize: 'clamp(40px, 5vw, 60px)',
          color: '#1A1510', lineHeight: 1.05, marginBottom: 56,
        }}>
          Your Sabha awaits<br/>
          <em className="italic" style={{ fontStyle: 'italic' }}>its council.</em>
        </h1>

        {/* Session Code Card */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E8E3DC',
          padding: '48px',
          marginBottom: 32,
          borderRadius: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}>
          <p style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 10, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#767676',
            marginBottom: 12,
            fontWeight: 700,
          }}>SESSION CODE</p>

          <p style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 48, letterSpacing: '0.25em',
            color: '#9B1C1C', marginBottom: 12,
            fontWeight: 700,
          }}>{code}</p>

          <p style={{
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 12, color: '#767676', marginBottom: 32,
          }}>
            {typeof window !== 'undefined' ? window.location.origin : 'varant.ai'}/team/join/{code}
          </p>

          <button
            onClick={handleCopy}
            style={{
              width: '100%',
              border: '1px solid #E8E3DC',
              background: '#FFFFFF',
              color: '#1A1510',
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '16px',
              cursor: 'pointer',
              borderRadius: '9999px',
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            className="hover:bg-[#1A1510] hover:text-white"
          >
            {copied ? 'LINK COPIED ✓' : 'COPY INVITE LINK'}
          </button>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: '#E8E3DC',
          margin: '48px 0'
        }} />

        {/* Members */}
        <p style={{
          fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
          fontSize: 10, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#767676',
          marginBottom: 24,
          fontWeight: 700,
        }}>COUNCIL MEMBERS</p>

        {/* Members Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Host row */}
          <div style={{ 
            display: 'flex', alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '20px 24px', 
            background: '#FFFFFF',
            border: '1px solid #E8E3DC',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}> 
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}> 
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#9B1C1C' }} /> 
              <span style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: '#1A1510' }}> 
                You (Host) 
              </span> 
            </div> 
            <span style={{ 
              fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", 
              fontSize: 9, letterSpacing: '0.15em', 
              textTransform: 'uppercase', color: '#9B1C1C',
              background: 'rgba(155,28,28,0.05)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontWeight: 700,
            }}>HOST</span> 
          </div> 

          {/* Joined members */}
          {members.filter(m => !m.isHost).map(member => (
            <div key={member.id} style={{ 
              display: 'flex', alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: '20px 24px', 
              background: '#FFFFFF',
              border: '1px solid #E8E3DC',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}> 
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}> 
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: member.color }} /> 
                <span style={{ fontSize: 15, fontWeight: 500, color: '#1A1510' }}>{member.name}</span> 
              </div> 
              <span style={{ 
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", 
                fontSize: 10, color: '#767676',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}>{member.role}</span> 
            </div> 
          ))} 

          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 4 - members.filter(m=>!m.isHost).length) }).map((_, i) => (
            <div key={i} style={{ 
              border: '1px dashed #E8E3DC', 
              padding: '20px 24px',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.3)',
            }}> 
              <span style={{ 
                fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", 
                fontSize: 10, color: '#B8B0A8',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>Waiting for member...</span> 
            </div> 
          ))} 
        </div>

        {/* CTA */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          style={{
            width: '100%', marginTop: 48,
            background: canStart ? '#1A1510' : '#E8E3DC',
            color: '#FFFFFF',
            fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
            fontSize: 12, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            padding: '20px', border: 'none',
            cursor: canStart ? 'pointer' : 'not-allowed',
            opacity: canStart ? 1 : 0.6,
            borderRadius: '9999px',
            transition: 'all 0.3s ease',
            boxShadow: canStart ? '0 10px 25px rgba(26,21,16,0.15)' : 'none',
          }}
          className={canStart ? "hover:bg-[#9B1C1C] hover:translate-y-[-2px]" : ""}
        >
          CONVENE THE SABHA →
        </button>

        <p style={{
          fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
          fontSize: 10, color: '#767676',
          textAlign: 'center', marginTop: 24,
          letterSpacing: '0.05em',
        }}>
          Minimum 2 members required to begin deliberation
        </p>

      </div>
    </div>
  )
}

import React from 'react'
import logo from './CDS-logo.png'

export default function Header({ title }) {
  return (
    <div style={{
      background: '#0f172a',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginBottom: 20,
    }}>
      <img
        src={logo}
        alt="CDS logo"
        style={{ height: 34, width: 34, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
      />
      <div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.2px', lineHeight: 1.2 }}>
          {title}
        </div>
        <div style={{ color: '#475569', fontSize: '0.7rem', letterSpacing: '0.4px', textTransform: 'uppercase', fontWeight: 500, marginTop: 1 }}>
          CDR Banking API Explorer
        </div>
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#f1f5f9', fontSize: '0.8rem', fontWeight: 600 }}>Ahmad ElSayed</div>
          <div style={{ color: '#475569', fontSize: '0.68rem', fontWeight: 500 }}>github.com/Ackmed1337</div>
        </div>
        <span style={{
          background: '#1e3a8a',
          color: '#93c5fd',
          fontSize: '0.68rem',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 20,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
        }}>
          Demo
        </span>
      </div>
    </div>
  )
}

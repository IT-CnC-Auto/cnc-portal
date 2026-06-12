'use client'
// src/app/auth/mfa/verify/_components/MFAVerifyContent.tsx

import { Suspense } from 'react'
import MFAVerifyContent from './_components/MFAVerifyContent'

export default function MFAVerifyPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
        <p style={{ fontFamily: 'Arial, sans-serif', color: '#6b7280' }}>Loading…</p>
      </div>
    }>
      <MFAVerifyContent />
    </Suspense>
  )
}

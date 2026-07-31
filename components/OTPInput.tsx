'use client'

import { useEffect, useRef } from 'react'

interface OTPInputProps {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export function OTPInput({ value, onChange, disabled = false }: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const prevValue = useRef(value)

  // When the code is cleared after a failed attempt, put focus back on the
  // first box so the user can retype immediately. Mount behaviour unchanged.
  useEffect(() => {
    if (prevValue.current !== '' && value === '') refs.current[0]?.focus()
    prevValue.current = value
  }, [value])

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const char = e.target.value.replace(/\D/g, '').slice(-1)
    const next = value.split('').concat(Array(6).fill('')).slice(0, 6)
    next[i] = char
    onChange(next.join(''))
    if (char && i < 5) refs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      const next = value.split('').concat(Array(6).fill('')).slice(0, 6)
      if (!value[i] && i > 0) {
        next[i - 1] = ''
        onChange(next.join(''))
        refs.current[i - 1]?.focus()
      } else {
        next[i] = ''
        onChange(next.join(''))
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted) {
      onChange(pasted.padEnd(6, '').slice(0, 6))
      refs.current[Math.min(pasted.length, 5)]?.focus()
    }
    e.preventDefault()
  }

  return (
    <div className="flex gap-2 justify-center my-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          disabled={disabled}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-11 h-14 text-center text-xl font-bold font-heading border border-cnc-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cnc-red focus:border-transparent text-cnc-black disabled:opacity-50 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  )
}

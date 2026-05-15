'use client'

import { useState, FormEvent } from 'react'

interface FormState {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'submitting' | 'success' | 'error'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [validationError, setValidationError] = useState('')

  const isComplete =
    form.name.trim() &&
    form.message.trim() &&
    isValidEmail(form.email)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setValidationError('')

    if (!isValidEmail(form.email)) {
      setValidationError('Please enter a valid email address.')
      return
    }

    setStatus('submitting')
    try {
      const id = process.env.NEXT_PUBLIC_FORMSPREE_ID
      const res = await fetch(`https://formspree.io/f/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '17px',
    fontWeight: 400,
    lineHeight: 1.47,
    letterSpacing: '-0.374px',
    color: '#1d1d1f',
    backgroundColor: '#fff',
    border: '1px solid #d2d2d7',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1d1d1f',
    marginBottom: '6px',
    letterSpacing: '-0.224px',
  }

  if (status === 'success') {
    return (
      <div role="status" style={{ padding: '32px 0', textAlign: 'center' }}>
        <p style={{ fontSize: '21px', fontWeight: 600, color: '#1d1d1f', marginBottom: '8px' }}>
          Message sent!
        </p>
        <p style={{ fontSize: '17px', color: '#7a7a7a' }}>
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label htmlFor="cf-name" style={labelStyle}>Name</label>
        <input
          id="cf-name"
          type="text"
          aria-required="true"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Your name"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="cf-email" style={labelStyle}>Email</label>
        <input
          id="cf-email"
          type="email"
          aria-required="true"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="cf-message" style={labelStyle}>Message</label>
        <textarea
          id="cf-message"
          aria-required="true"
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="What's on your mind?"
          rows={5}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      </div>

      {(validationError || status === 'error') && (
        <p role="alert" style={{ color: '#c0392b', fontSize: '14px', margin: 0 }}>
          {validationError || 'Something went wrong. Please try again.'}
        </p>
      )}

      <button
        type="submit"
        disabled={!isComplete || status === 'submitting'}
        className="btn-primary"
        style={{
          opacity: !isComplete || status === 'submitting' ? 0.5 : 1,
          cursor: !isComplete || status === 'submitting' ? 'not-allowed' : 'pointer',
          alignSelf: 'flex-start',
        }}
      >
        {status === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}

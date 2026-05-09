import { NextRequest, NextResponse } from 'next/server'

// Stub endpoint — accepts pre-launch email signups.
// Real backend (Mailchimp / ConvertKit / Resend) can be wired here later.
// Returns { ok: true } for any valid POST so the form shows the success state.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body?.email ?? '').toString().trim()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Invalid email' }, { status: 400 })
    }

    // TODO: forward `email` to your email provider when ready
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }
}

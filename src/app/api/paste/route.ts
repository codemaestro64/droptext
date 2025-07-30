import { NextRequest, NextResponse } from 'next/server'
import { findPaste } from '@/database/pasteRepository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await findPaste("ddd")
    console.log(res)

    const { content, language, expiration, hasPassword } = body;

    if (!content || !language) {
      return NextResponse.json({ error: 'Missing content or language' }, { status: 400 });
    }

    // simulate saving
    const pasteId = Math.random().toString(36).substring(2, 8); // e.g. "abc123"

    return NextResponse.json({ id: pasteId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' + e }, { status: 500 });
  }
}

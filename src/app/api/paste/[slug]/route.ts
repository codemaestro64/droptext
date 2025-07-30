import { NextRequest, NextResponse } from 'next/server';
import { Paste } from '@/types/database';
import { findPaste } from '@/database/pasteRepository';

type Params = { slug: string };

export async function GET(req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await context.params;

  try {
    const paste = await findPaste(slug); 
    console.log(paste)
    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    // TODO: increase counter or delete if applicable
    return NextResponse.json(paste, { status: 200 });

  } catch (error) {
    console.error('Paste fetching failed:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        type: 'server',
      },
      { status: 500 }
    );
  }
}

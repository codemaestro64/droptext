import { NextRequest, NextResponse } from 'next/server';
import { deletePaste, findPaste } from '@/database/pasteRepository';

type Params = { slug: string };

export async function GET(req: NextRequest, context: { params: Promise<Params> }) {
  const { slug } = await context.params;

  try {
    const paste = await findPaste(slug); 
    if (!paste) {
      return NextResponse.json({ error: 'Paste not found' }, { status: 404 });
    }

    const responsePaste = paste

    if (paste.burnAfterReading && paste.views == 1) {
      await deletePaste(slug)
    } else if (paste.expiresAt < Date.now()) {
      
    }

    

    // TODO: increase counter or delete if applicable
    return NextResponse.json(responsePaste, { status: 200 });

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

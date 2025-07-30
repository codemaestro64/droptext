import { NextRequest, NextResponse } from 'next/server';
import { createPaste } from '@/database/pasteRepository';
import { pasteSchema } from '@/schemas/paste.schema';
import { generateUUID } from '@/utils';
import { NewPaste } from '@/types/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = pasteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          issues: parsed.error.issues,
          type: 'validation',
        },
        { status: 400 }
      );
    }

    const { content, language, hasPassword, duration } = parsed.data;

    const newPaste: NewPaste = {
      uuid: generateUUID(10),
      views: 0,
      content,
      language,
      hasPassword: hasPassword ? 1 : 0,
      duration,
    };
    
    const res = await createPaste(newPaste);

    return NextResponse.json({ uuid: res.uuid }, { status: 201 });
  } catch (error) {
    console.error('Paste creation failed:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        type: 'server',
      },
      { status: 500 }
    );
  }
}

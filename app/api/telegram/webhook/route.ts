import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.message?.text || 'default';
    await sql`INSERT INTO border_queues (queue_name, status, metadata) VALUES (${text}, 'processing', ${JSON.stringify(body)})`;
    return NextResponse.json({ ok: true, message: 'Ingested' });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
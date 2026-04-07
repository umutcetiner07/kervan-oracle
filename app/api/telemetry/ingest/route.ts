import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, payload } = body;
    if (!deviceId || !payload) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await sql`
      INSERT INTO telemetry_streams (id, device_id, payload, received_at)
      VALUES (gen_random_uuid(), ${deviceId}, ${JSON.stringify(payload)}, NOW())
    `;
    return NextResponse.json({ status: 'ingested' });
  } catch (error: any) {
    console.error('Telemetry error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

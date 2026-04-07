import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { analyzeTelemetry } from '@/lib/ai-parser';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { deviceId } = await req.json();
    if (!deviceId) return NextResponse.json({ error: 'Missing deviceId' }, { status: 400 });

    const result = await sql`SELECT payload FROM telemetry_streams WHERE device_id = ${deviceId} ORDER BY received_at DESC LIMIT 1`;
    
    if (!result || result.length === 0) {
      // Return mock analysis when no data exists
      const mockAnalysis = {
        risk_score: 10,
        anomalies: ["No telemetry data available"],
        timestamp: new Date().toISOString()
      };
      return NextResponse.json({ status: 'mock-analyzed', deviceId, ...mockAnalysis });
    }

    let payload = result[0].payload;
    if (typeof payload === 'string') payload = JSON.parse(payload);

    const analysis = await analyzeTelemetry(payload);
    
    return NextResponse.json({ status: 'analyzed', deviceId, ...analysis });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

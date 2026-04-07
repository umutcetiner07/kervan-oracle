import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Create extensions
    await sql`CREATE EXTENSION IF NOT EXISTS postgis`;
    await sql`CREATE EXTENSION IF NOT EXISTS timescaledb`;
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;

    // Drop old tables
    await sql`DROP TABLE IF EXISTS telemetry_streams CASCADE`;
    await sql`DROP TABLE IF EXISTS risk_scores CASCADE`;
    await sql`DROP TABLE IF EXISTS zk_proofs CASCADE`;

    // Create new tables
    await sql`
      CREATE TABLE gumruk_kuyruklari (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        border_name TEXT NOT NULL,
        wait_minutes INT DEFAULT 0,
        recorded_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE hs_kodlari (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hs_code TEXT NOT NULL,
        country TEXT NOT NULL,
        description JSONB,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE rota_alternatifleri (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        origin TEXT NOT NULL,
        destination TEXT NOT NULL,
        estimated_hours NUMERIC(5,2),
        risk_score NUMERIC(3,2) DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE fiyat_oracle (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        shipment_ref TEXT UNIQUE NOT NULL,
        kervan_score NUMERIC(4,2),
        delay_prob NUMERIC(3,2),
        tier TEXT DEFAULT 'standard',
        computed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE TABLE zkp_kanitlari (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ref_entity TEXT NOT NULL,
        proof_hash TEXT NOT NULL,
        onchain_tx TEXT,
        status TEXT DEFAULT 'verified',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Insert test data
    await sql`INSERT INTO gumruk_kuyruklari (border_name, wait_minutes) VALUES ('Korday Kapısı', 145), ('Saryagash', 60), ('Jibek Joly', 30)`;
    await sql`INSERT INTO fiyat_oracle (shipment_ref, kervan_score, delay_prob, tier) VALUES ('SHIP-KZ-001', 82.5, 0.15, 'audit'), ('SHIP-TR-042', 24.0, 0.02, 'standard')`;
    await sql`INSERT INTO zkp_kanitlari (ref_entity, proof_hash, onchain_tx) VALUES ('SHIP-KZ-001', '0x7f8a9b...', '0xTxSepolia_9921')`;

    return NextResponse.json({ status: 'database-setup-complete' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

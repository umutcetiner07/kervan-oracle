import { sql } from '@/lib/db';

export default async function Dashboard() {
  const gumrukKuyruklari = await sql`SELECT * FROM gumruk_kuyruklari ORDER BY recorded_at DESC LIMIT 10`;
  const fiyatOracle = await sql`SELECT * FROM fiyat_oracle ORDER BY computed_at DESC LIMIT 10`;
  const zkpKanitlari = await sql`SELECT * FROM zkp_kanitlari ORDER BY created_at DESC LIMIT 10`;

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans text-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">� Kervan Oracle - Sınır Geçiş & Risk Tahmini</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sol Panel: Gümrük Kuyrukları */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">🚧 Gümrük Kuyrukları</h2>
          <div className="space-y-3">
            {gumrukKuyruklari.map((kuyruk: any) => (
              <div key={kuyruk.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="font-semibold text-gray-800">{kuyruk.border_name}</p>
                <p className="text-sm text-gray-600">Bekleme Süresi: <span className="font-bold text-orange-600">{kuyruk.wait_minutes} dakika</span></p>
                <p className="text-xs text-gray-400 mt-1">{String(kuyruk.recorded_at)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ Panel: Kervan Risk Skoru */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">📊 Kervan Risk Skoru</h2>
          <div className="space-y-3">
            {fiyatOracle.map((fiyat: any) => (
              <div key={fiyat.id} className="p-4 bg-gray-50 rounded border border-gray-200">
                <p className="font-semibold text-gray-800">{fiyat.shipment_ref}</p>
                <p className="text-sm text-gray-600">Risk Skoru: <span className={`font-bold ${Number(fiyat.kervan_score) > 50 ? 'text-red-600' : 'text-green-600'}`}>{fiyat.kervan_score}</span></p>
                <p className="text-sm text-gray-600">Tier: <span className="font-medium">{fiyat.tier}</span></p>
                <p className="text-sm text-gray-600">Gecikme Olasılığı: <span className="font-bold text-orange-600">{(Number(fiyat.delay_prob) * 100).toFixed(1)}%</span></p>
                <p className="text-xs text-gray-400 mt-1">{String(fiyat.computed_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alt Kısım: ZKP Kanıtları */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-700">🔐 ZKP Kanıtları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zkpKanitlari.map((kanit: any) => (
            <div key={kanit.id} className="p-4 bg-gray-50 rounded border border-gray-200">
              <p className="font-semibold text-gray-800">{kanit.ref_entity}</p>
              <p className="text-sm text-gray-600 truncate">Tx Hash: <span className="font-mono text-green-600">{kanit.onchain_tx}</span></p>
              <p className="text-sm text-gray-600">Durum: <span className={`font-medium ${kanit.status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>{kanit.status}</span></p>
              <p className="text-xs text-gray-400 mt-1">{String(kanit.created_at)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

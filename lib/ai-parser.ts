export async function analyzeTelemetry(payload: any) {
  // Simulated AI Logic (Asset-light phase)
  let risk_score = 10;
  let anomalies: string[] = [];
  
  if (payload.temp > 45) {
    risk_score += 40;
    anomalies.push("Critical Temperature");
  }
  if (payload.battery < 20) {
    risk_score += 30;
    anomalies.push("Low Battery");
  }
  if (risk_score > 80) anomalies.push("System Unstable");

  return {
    risk_score: Math.min(risk_score, 100),
    anomalies,
    timestamp: new Date().toISOString()
  };
}

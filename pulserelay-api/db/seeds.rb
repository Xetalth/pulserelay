Incident.destroy_all
Service.destroy_all

services_data = [
  { name: "Trip Dispatch Engine", status: "operational", uptime_percentage: 99.98 },
  { name: "Dynamic Surge Pricing", status: "degraded", uptime_percentage: 98.45 },
  { name: "Stripe & PSP Payment Gateway", status: "operational", uptime_percentage: 99.99 },
  { name: "Driver Geolocation Tracking", status: "operational", uptime_percentage: 99.92 }
]

services = services_data.map { |data| Service.create!(data) }

surge_service = services.find { |s| s.name == "Dynamic Surge Pricing" }

Incident.create!(
  service: surge_service,
  title: "Surge Multiplier Redis Cache Invalidation Loop",
  description: "Redis cluster replica latency spiked above 1200ms, triggering cascading stale cache reads across ride matching workers in EU-Central.",
  severity: "high",
  status: "triggered",
  ai_rca: "Redis 7.2 cluster node-3 replication buffer overflow caused memory fragmentation. Unthrottled invalidation keys created a thundering herd on primary nodes.",
  ai_remediation: "Execute failover to standby replica node-4 and apply circuit breaker rate-limiting on surge-cache workers (max 250 req/sec)."
)

puts "Demo verileri basariyla yuklendi: #{Service.count} servis, #{Incident.count} aktif olay."
"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Flame,
  Plus,
  RefreshCw, 
  ShieldAlert, 
  Sparkles, 
  X,
  Zap 
} from "lucide-react";

interface Service {
  id: number;
  name: string;
  status: "operational" | "degraded" | "outage";
  uptime_percentage: number;
}

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "triggered" | "acknowledged" | "resolved";
  ai_rca?: string;
  ai_remediation?: string;
  created_at: string;
  service?: {
    id: number;
    name: string;
  };
}

const DEMO_INCIDENT_TEMPLATES = [
  {
    title: "Trip Dispatch Engine Spike in Deadlocks",
    description: "Postgres write queue blocked on geospatial index lock. 4500 ride match requests timed out across central cluster.",
    severity: "critical" as const,
  },
  {
    title: "Stripe PSP Webhook Signature Mismatch",
    description: "TLS termination proxy dropped custom HMAC headers. Inbound webhook callbacks from Stripe returning 401 unauthorized.",
    severity: "high" as const,
  },
  {
    title: "Driver Geolocation Kafka Lag Exceeded SLA",
    description: "Consumer group driver-tracking-partition-8 lagged over 85,000 offsets. Real-time passenger maps showing 15s stale location.",
    severity: "high" as const,
  },
  {
    title: "Dynamic Surge Model Cold Start Outage",
    description: "Machine learning inference container crashed with OOMKilled code 137 under sudden thunderstorm demand surge.",
    severity: "critical" as const,
  }
];

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentSeverity, setIncidentSeverity] = useState<"low" | "medium" | "high" | "critical">("high");
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resServices, resIncidents] = await Promise.all([
        fetch(`${apiUrl}/api/v1/services`),
        fetch(`${apiUrl}/api/v1/incidents`)
      ]);

      if (!resServices.ok || !resIncidents.ok) {
        throw new Error("API uç noktalarından veri çekilemedi.");
      }

      const servicesData = await resServices.json();
      const incidentsData = await resIncidents.json();

      setServices(servicesData);
      setIncidents(incidentsData);
      if (servicesData.length > 0 && !selectedServiceId) {
        setSelectedServiceId(servicesData[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyTemplate = (tpl: typeof DEMO_INCIDENT_TEMPLATES[0]) => {
    setIncidentTitle(tpl.title);
    setIncidentDescription(tpl.description);
    setIncidentSeverity(tpl.severity);
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !incidentTitle) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/v1/incidents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incident: {
            service_id: selectedServiceId,
            title: incidentTitle,
            description: incidentDescription,
            severity: incidentSeverity,
            status: "triggered"
          }
        })
      });

      if (!res.ok) {
        throw new Error("Olay kaydı oluşturulamadı.");
      }

      setIsModalOpen(false);
      setIncidentTitle("");
      setIncidentDescription("");
      await fetchData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Hata oluştu");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: Service["status"]) => {
    switch (status) {
      case "operational":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5"/> Operational</span>;
      case "degraded":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><AlertCircle className="w-3.5 h-3.5"/> Degraded</span>;
      case "outage":
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20"><ShieldAlert className="w-3.5 h-3.5"/> Outage</span>;
    }
  };

  const getSeverityBadge = (sev: Incident["severity"]) => {
    const map = {
      low: "bg-slate-800 text-slate-300 border-slate-700",
      medium: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      critical: "bg-rose-500/15 text-rose-400 border-rose-500/30 font-semibold"
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border ${map[sev]}`}>
        {sev}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap className="w-5 h-5 fill-current"/>
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-white block">PulseRelay</span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium">Autonomous Incident Response</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition rounded-lg text-xs font-semibold text-white shadow-lg shadow-purple-600/20"
            >
              <Flame className="w-3.5 h-3.5 fill-current"/>
              Simulate Incident
            </button>

            <button 
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 transition rounded-lg text-xs font-medium border border-slate-700/60 text-slate-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Yenile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {error && (
          <div className="p-4 rounded-xl border border-rose-800/50 bg-rose-950/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0"/>
            <span>{error}</span>
          </div>
        )}

        {/* System Services Overview */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400"/>
              Monitored Microservices
            </h2>
            <span className="text-xs text-slate-500 font-mono">{services.length} services active</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((svc) => (
              <div 
                key={svc.id} 
                className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:border-slate-700/60 transition flex flex-col justify-between gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-medium text-slate-200 text-sm">{svc.name}</h3>
                  </div>
                  {getStatusBadge(svc.status)}
                </div>
                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Uptime</span>
                  <span className="text-slate-200 font-semibold">{svc.uptime_percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Incidents & AI RCA Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400"/>
              Active Incident Feed & AI Root-Cause Analysis
            </h2>
            <span className="text-xs text-slate-500 font-mono">{incidents.length} incidents open</span>
          </div>

          <div className="space-y-4">
            {incidents.length === 0 ? (
              <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/20 text-center text-sm text-slate-500">
                Hiçbir aktif olay kaydı bulunmuyor. Sistemler stabil.
              </div>
            ) : (
              incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="rounded-2xl border border-rose-900/30 bg-gradient-to-b from-slate-900/90 to-slate-900/40 p-6 space-y-5 shadow-xl"
                >
                  {/* Incident Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        {getSeverityBadge(incident.severity)}
                        <span className="text-xs text-purple-400 font-mono">[{incident.service?.name || "General"}]</span>
                        <h3 className="font-semibold text-slate-100 text-base">{incident.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl pt-1">
                        {incident.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <Clock className="w-3.5 h-3.5"/>
                      {new Date(incident.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  {/* AI Root-Cause & Remediation Module */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-purple-900/40 bg-purple-950/15 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400"/>
                        AI Root Cause Analysis (RCA)
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {incident.ai_rca || "Analiz henüz üretilmedi."}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-emerald-900/40 bg-emerald-950/15 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        <Zap className="w-3.5 h-3.5 text-emerald-400"/>
                        Recommended Action Plan
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {incident.ai_remediation || "Eylem planı beklemede."}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Incident Simulation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-purple-400"/>
                <h3 className="font-semibold text-white text-base">Simulate Enterprise Incident</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>

            {/* Quick Templates */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Enterprise Scenarios</label>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_INCIDENT_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyTemplate(tpl)}
                    className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/50 hover:border-purple-500/40 text-left text-xs transition space-y-1"
                  >
                    <div className="font-medium text-slate-200 line-clamp-1">{tpl.title}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{tpl.severity}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Impacted Microservice</label>
                <select 
                  value={selectedServiceId || ""} 
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Incident Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Postgres Connection Pool Starvation"
                  value={incidentTitle}
                  onChange={(e) => setIncidentTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Telemetry & Diagnostic Logs</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="System logs, error traces, or metric spikes..."
                  value={incidentDescription}
                  onChange={(e) => setIncidentDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Severity</label>
                <select 
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 transition rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${submitting ? "animate-spin" : ""}`} />
                  {submitting ? "AI Analizi Yapılıyor..." : "Tetikle & Analiz Et"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
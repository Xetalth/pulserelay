"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>("Backend aranıyor...");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/health`)
      .then((res) => {
        if (!res.ok) throw new Error("Ağ yanıtı başarısız");
        return res.json();
      })
      .then((data) => {
        setApiStatus(`Bağlantı Başarılı: ${data.service} v${data.version} (${data.status})`);
        setIsSuccess(true);
      })
      .catch((err) => {
        setApiStatus(`Bağlantı Hatası: ${err.message}`);
        setIsSuccess(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl backdrop-blur-sm">
        <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">PulseRelay</h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">Autonomous Incident Response</p>
        
        <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-mono transition-all ${
          isSuccess === true
            ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
            : isSuccess === false
            ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
            : "bg-slate-800/60 border-slate-700 text-slate-300"
        }`}>
          {isSuccess === true && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {isSuccess === false && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{apiStatus}</span>
        </div>
      </div>
    </main>
  );
}
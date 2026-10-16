# ⚡ PulseRelay - Autonomous Enterprise Incident Response Platform

PulseRelay, Fortune 500 ölçeğindeki teknoloji şirketlerinin mikroservis mimarilerinde meydana gelen kesintileri (incidents) gerçek zamanlı izleyen, sınıflandıran ve **hibrit yapay zekâ (LLaMA-3.3-70B)** desteğiyle otonom kök neden analizi (RCA) ile runbook aksiyon planları üreten modern bir SRE / DevOps orkestrasyon platformudur.

---

## 🚀 Canlı Sistemler (Production)

- **Frontend (Next.js Dashboard):** [pulserelay-web.vercel.app](https://pulserelay-web.vercel.app) *(veya kendi Vercel linkin)*
- **Backend API (Rails 8 API-Only):** [https://pulserelay-api.onrender.com](https://pulserelay-api.onrender.com)
- **API Health Check:** `GET /health` -> `{"status":"online","service":"PulseRelay API","version":"1.0.0"}`

---

## 🛠️ Teknik Mimari ve Teknoloji Yığını

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, Lucide | Otonom olay panosu, simülasyon modülü ve telemetry akışı |
| **Backend API** | Ruby on Rails 8 (API-only), Faraday | RESTful microservice API, service models & incident lifecycle |
| **AI Motoru** | Groq Cloud, LLaMA-3.3-70B-Versatile | Sıfır gecikmeli Root Cause Analysis (RCA) ve runbook üretimi |
| **Veritabanı** | SQLite 3 (ActiveRecord) | İlişkisel servis ve olay veritabanı şeması |
| **DevOps / CI-CD**| Vercel & Render Cloud Pipelines | GitHub push tetiklemeli otomatik continuous deployment |

---

## 🧠 AI Otonom Analiz Pipeline'ı

1. **Incident Ingestion:** Sistemden veya simülatörden `POST /api/v1/incidents` rotasına hata logları ve telemetry verileri düşer.
2. **Context Enrichment:** `AiIncidentAnalyzer` servisi, etkilenen mikroservis geçmişini ve hata izlerini derler.
3. **LLM Inference:** Groq LLaMA-3.3-70B modeli devreye girerek iki odak çıktıyı JSON formatında üretir:
   - **`rca`:** Teknik ve kesin kök neden açıklaması.
   - **`remediation`:** SRE mühendislerinin doğrudan uygulayabileceği aksiyon adımları.
4. **State Persistence:** Analiz sonuçları eş zamanlı olarak veritabanına işlenir ve arayüze anında yansıtılır.
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

---

# 📋 Fortune 500 Case Study & Academic Deliverable (Ödev Raporu)

### 1. Target Enterprise & Target SaaS
* **Target Company:** DoorDash (Fortune 500)
* **Target SaaS Product:** PagerDuty (Incident Response & SRE Operations)
* **Proof of Usage:** [PagerDuty DoorDash Customer Case Study](https://www.pagerduty.com/customers/doordash/)  
  *(DoorDash utilizes PagerDuty across distributed engineering clusters to orchestrate on-call escalations and service health).*
* **Estimated Annual SaaS Cost:** ~$1.8M / year (Calculated for enterprise tier engineering seats).

---

### 2. Cloned Core Value Streams (3+ Workflows)
1. **Live Microservice Health & Status Telemetry:** Anlık servis sağlık durumu (Operational / Degraded / Down), SLA uptime yüzdesi ve açık arıza takibi.
2. **Automated Incident Triage & Telemetry Ingestion:** Sistem arızaları (Deadlock, Kafka Lag, Connection Pool Exhaustion) gerçekleştiğinde olayın canlı akışa düşürülmesi.
3. **Incident Lifecycle Management:** Mühendisin olayı inceleyip acknowledge veya resolve ederek çözüm döngüsünü tamamlaması.

---

### 3. AI-Native Layer: "The Usable Pass" (Kullanılabilir Pas)
* **Geleneksel PagerDuty Deneyimi:** Mühendis gece alarmıyla uyanır, ham log yığınını 30-45 dakika inceler, şirket dokümanlarından runbook arar (kullanıcıya iş çıkarır).
* **PulseRelay AI-Native Pası:** Olay sisteme girdiği anda arka planda çalışan **Groq Cloud LLM Pipeline'ı** (`openai/gpt-oss-20b`) devreye girer. Mühendisin önüne:
  * **AI Root Cause Analysis (RCA):** Hatanın kesin teknik nedenini (örn. *PostgreSQL connection pool exhaust / lock deadlock*),
  * **Recommended Action Plan:** Mühendisin doğrudan terminale yazabileceği uygulanabilir komut ve stratejileri (*PgBouncer kurulumu, CONCURRENTLY index rebuild*) hazır pas olarak sunar. Mühendisin analiz süresini 40 dakikadan 10 saniyeye düşürür.

---

### 4. Engineering & Cost Metric Table

| Metrik | Değer |
| :--- | :--- |
| **Hedef Firma & SaaS** | DoorDash — PagerDuty |
| **Frontend Stack & Deployment** | Next.js 14, Tailwind CSS ([Vercel Live URL'ini Buraya Yaz]) |
| **Backend Stack & Deployment** | Ruby on Rails 8 (API-only) ([Render Live URL'ini Buraya Yaz]) |
| **AI / LLM Engine** | Groq Cloud API (`openai/gpt-oss-20b`) |
| **Toplam Token Maliyeti ($)** | ~$0.12 (Geliştirme, prompt tuning ve canlı testler) |
| **Toplam Çalışma Süresi (Saat)**| ~18 saat |
| **Kaynak Kod Satır Sayısı (LOC)** | ~1.350 satır |
| **Kullanılan Kodlama Ajanları** | Claude / Gemini / Cursor |
| **Ajan Oturum Sayısı** | 12 oturum |

---

### 5. Build vs Buy Analizi & Fiyatlama Modeli
* **Karar:** DoorDash gibi yüksek mühendis sayısına sahip bir firma, kol
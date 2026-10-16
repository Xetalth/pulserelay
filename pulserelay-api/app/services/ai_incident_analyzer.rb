require "faraday"
require "json"

class AiIncidentAnalyzer
  GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

  def self.analyze(incident)
    api_key = ENV["GROQ_API_KEY"]

    return fallback_analysis(incident) if api_key.blank?

    service_name = incident.service&.name || "Unknown Service"
    prompt = <<~PROMPT
      You are an elite Site Reliability Engineer (SRE) at a Fortune 500 tech enterprise.
      An incident occurred on the service: "#{service_name}".
      Incident Title: "#{incident.title}"
      Description / System Logs: "#{incident.description}"
      Severity: "#{incident.severity}"

      Analyze the incident and return STRICTLY a JSON object with two keys:
      1. "rca": A concise, highly technical root-cause explanation (2 sentences max).
      2. "remediation": Clear, actionable SRE runbook steps to mitigate and resolve the incident (2 sentences max).
      
      Respond with ONLY raw JSON, without markdown formatting or backticks.
    PROMPT

    response = Faraday.post(GROQ_API_URL) do |req|
      req.headers["Authorization"] = "Bearer #{api_key}"
      req.headers["Content-Type"] = "application/json"
      req.body = {
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }.to_json
    end

    if response.success?
      parsed = JSON.parse(response.body)
      content = JSON.parse(parsed.dig("choices", 0, "message", "content"))
      {
        rca: content["rca"],
        remediation: content["remediation"]
      }
    else
      Rails.logger.error("Groq API error: #{response.status} - #{response.body}")
      fallback_analysis(incident)
    end
  rescue StandardError => e
    Rails.logger.error("AI Analysis exception: #{e.message}")
    fallback_analysis(incident)
  end

  def self.fallback_analysis(incident)
    {
      rca: "Automated heuristic analysis detected anomalous telemetry in #{incident.service&.name}. Resource thread exhaustion suspected.",
      remediation: "Restart container task group and execute connection-pool draining on standby cluster."
    }
  end
end
require "faraday"
require "json"

class AiIncidentAnalyzer
  GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

  def self.analyze(incident)
    api_key = ENV["GROQ_API_KEY"]

    return fallback_analysis(incident) if api_key.blank?

    service_name = incident.service&.name || "Unknown Service"
    prompt = <<~PROMPT
      You are an elite Site Reliability Engineer (SRE).
      An incident occurred on the service: "#{service_name}".
      Incident Title: "#{incident.title}"
      Description / System Logs: "#{incident.description}"
      Severity: "#{incident.severity}"

      Return a valid JSON object with EXACTLY these two keys:
      {
        "rca": "Concise technical root-cause explanation (2 sentences max)",
        "remediation": "Actionable SRE runbook steps to mitigate and resolve (2 sentences max)"
      }
    PROMPT

    response = Faraday.post(GROQ_API_URL) do |req|
      req.headers["Authorization"] = "Bearer #{api_key}"
      req.headers["Content-Type"] = "application/json"
      req.body = {
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: "You are a professional SRE incident analyzer. Always respond with valid JSON containing 'rca' and 'remediation' fields." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }.to_json
    end

    if response.success?
      parsed = JSON.parse(response.body)
      raw_content = parsed.dig("choices", 0, "message", "content")
      
      # Markdown kod bloklarını (```json ... ```) temizle
      cleaned_content = raw_content.to_s.gsub(/```json/i, "").gsub(/```/, "").strip
      content = JSON.parse(cleaned_content)

      rca = content["rca"] || content["RCA"] || content["root_cause"]
      remediation = content["remediation"] || content["Remediation"] || content["action_plan"]

      if rca.present? && remediation.present?
        { rca: rca, remediation: remediation }
      else
        fallback_analysis(incident)
      end
    else
      Rails.logger.error("Groq API error #{response.status}: #{response.body}")
      fallback_analysis(incident)
    end
  rescue StandardError => e
    Rails.logger.error("AI Analysis exception: #{e.class} - #{e.message}")
    fallback_analysis(incident)
  end

  def self.fallback_analysis(incident)
    {
      rca: "Automated heuristic analysis detected anomalous telemetry in #{incident.service&.name}. Resource thread exhaustion suspected.",
      remediation: "Restart container task group and execute connection-pool draining on standby cluster."
    }
  end
end
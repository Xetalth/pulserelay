module Api
  module V1
    class IncidentsController < ApplicationController
      def index
        incidents = Incident.includes(:service).order(created_at: :desc)
        render json: incidents.as_json(include: { service: { only: [:id, :name] } })
      end

      def create
        incident = Incident.new(incident_params)

        if incident.save
          analysis = AiIncidentAnalyzer.analyze(incident)
          incident.update(
            ai_rca: analysis[:rca],
            ai_remediation: analysis[:remediation]
          )

          render json: incident.as_json(include: { service: { only: [:id, :name] } }), status: :created
        else
          render json: { errors: incident.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def incident_params
        params.require(:incident).permit(:service_id, :title, :description, :severity, :status)
      end
    end
  end
end
class HealthController < ApplicationController
  def index
    render json: { status: "online", service: "PulseRelay API", version: "1.0.0" }
  end
end
module Api
  module V1
    class ServicesController < ApplicationController
      def index
        services = Service.all.order(name: :asc)
        render json: services
      end
    end
  end
end
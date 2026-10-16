Rails.application.routes.draw do
  get "/health", to: ->(env) { [200, { "Content-Type" => "application/json" }, ['{"status":"online","service":"PulseRelay API","version":"1.0.0"}']] }

  namespace :api do
    namespace :v1 do
      resources :services, only: [:index]
      resources :incidents, only: [:index, :create]
    end
  end
end
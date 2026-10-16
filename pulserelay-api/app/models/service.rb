class Service < ApplicationRecord
  has_many :incidents, dependent: :destroy

  validates :name, presence: true
  validates :status, inclusion: { in: %w[operational degraded outage] }
end
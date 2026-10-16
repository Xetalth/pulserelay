class Incident < ApplicationRecord
  belongs_to :service

  validates :title, presence: true
  validates :severity, inclusion: { in: %w[low medium high critical] }
  validates :status, inclusion: { in: %w[triggered acknowledged resolved] }
end
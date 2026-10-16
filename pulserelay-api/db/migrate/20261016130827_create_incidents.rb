class CreateIncidents < ActiveRecord::Migration[8.1]
  def change
    create_table :incidents do |t|
      t.references :service, null: false, foreign_key: true
      t.string :title
      t.text :description
      t.string :severity
      t.string :status
      t.text :ai_rca
      t.text :ai_remediation

      t.timestamps
    end
  end
end

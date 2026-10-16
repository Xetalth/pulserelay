class CreateServices < ActiveRecord::Migration[8.1]
  def change
    create_table :services do |t|
      t.string :name
      t.string :status
      t.float :uptime_percentage
      t.datetime :last_incident_at

      t.timestamps
    end
  end
end

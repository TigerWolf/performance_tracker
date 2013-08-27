class CreatePortfolios < ActiveRecord::Migration
  def change
    create_table :portfolios do |t|
      t.string :name
      t.string :client_id
      t.string :montly_budget
      t.string :campaigns
      t.string :cost

      t.timestamps
    end
  end
end

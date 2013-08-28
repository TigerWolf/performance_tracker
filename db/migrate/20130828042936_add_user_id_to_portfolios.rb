class AddUserIdToPortfolios < ActiveRecord::Migration
  def change
    add_column :portfolios, :user_id, :number
  end
end

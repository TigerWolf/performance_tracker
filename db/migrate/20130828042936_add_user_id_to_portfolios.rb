class AddUserIdToPortfolios < ActiveRecord::Migration
  def change
    add_column :portfolios, :user_id, :integer
  end
end

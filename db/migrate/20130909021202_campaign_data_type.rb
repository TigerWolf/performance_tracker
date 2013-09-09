class CampaignDataType < ActiveRecord::Migration
  def change
    change_column(:portfolios, :campaigns, :text)
  end
end

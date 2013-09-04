module PortfoliosHelper
  def self.to_deci(micro)
    (micro.to_f / 100) / 10000
  end  
end

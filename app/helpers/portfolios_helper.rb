module PortfoliosHelper
  def self.to_deci(micro)
    (micro / 100).to_f / 10000
  end  
end

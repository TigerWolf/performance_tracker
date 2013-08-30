module PortfoliosHelper
  def self.to_deci(micro)
    (micro / 100).round / 10000
  end  
end

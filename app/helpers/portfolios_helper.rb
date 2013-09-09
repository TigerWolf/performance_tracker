module PortfoliosHelper
  def self.to_deci(micro)
    (micro.to_f / 100) / 10000
  end

  # Only display exact and partial matches (2 chars needed)
  def self.search_sort(term, records)
    term = term.downcase
    record["text"] = record["text"].downcase
    exact_matches   = []
    partial_matches = []
    records.each do |record|
      if term == record["text"]
        exact_matches << record
      elsif term.slice(0, 2) == record["text"].slice(0, 2)
        partial_matches << record
      end
    end
    sorted = exact_matches + partial_matches
  end

end

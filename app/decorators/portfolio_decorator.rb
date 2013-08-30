class PortfolioDecorator < Draper::Decorator
  delegate_all

  def difference
    if object.cost.present? && object.cost.to_i > 0 && object.montly_budget.to_f > 0 
      days_in_month = Time.days_in_month(Time.now.month)
      days_so_far_this_month = Time.now.day
      daily_budget = object.montly_budget.to_f/days_in_month
      current_target = daily_budget*days_so_far_this_month
      difference = current_target - object.cost.to_f
      -(difference.to_f/current_target)*100
    else
      0
    end
  end

  def difference_class
    if object.decorate.difference.abs > 10
      "error"
    elsif object.decorate.difference.abs > 5 
      "warning"
    else
      "success"
    end
  end 

  def budget_left_per_day
    #TODO - Need to ensure that float operations are done correctly.
    d = Date.today
    (object.cost.to_i - object.montly_budget.to_i)/(d.day.to_i - d.end_of_month.day.to_i)
  end

end
$redis = Redis::Namespace.new("performance_tracker", :redis => Redis.new)

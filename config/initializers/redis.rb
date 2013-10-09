# Load the redis.yml configuration file
redis_config = YAML.load_file(Rails.root + 'config/redis.yml')[Rails.env]

# Connect to Redis using the redis_config host and port
if redis_config
  $redis_instance = Redis.new(host: redis_config['host'], port: redis_config['port'])
end

$redis = Redis::Namespace.new("performance_tracker", :redis => $redis_instance)

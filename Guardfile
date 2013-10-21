if File.exists?("./config.rb")
  # Compile on start.
  puts `compass compile --time --quiet`
  # https://github.com/guard/guard-compass
  guard :compass do
    watch(%r{(.*)\.s[ac]ss$})
  end
end

guard :compass do
  watch(%r{(.*)\.s[ac]ss$})
end

guard :livereload do
  watch(%r{app/views/.+\.(erb|haml|slim)$})
  watch(%r{app/helpers/.+\.rb})
  watch(%r{public/.+\.(css|js|html)})
  watch(%r{config/locales/.+\.yml})
  # Rails Assets Pipeline
  watch(%r{(app|vendor)(/assets/\w+/(.+\.(css|js|coffee|html))).*}) { |m| "/assets/#{m[3]}" }
end

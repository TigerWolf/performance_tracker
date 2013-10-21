source 'https://rubygems.org'
ruby '2.0.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.0'

# Heroku Gem - instead of being injected
gem 'rails_12factor', group: :production

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

gem 'pg', '>= 0.11.0'

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# AdWords API gem.
gem 'google-adwords-api', '~> 0.9.3'

# Gem for OAuth authorization.
gem 'oauth2'

# Web Server
gem 'thin'

group :assets do
  # Use SCSS for stylesheets
  gem 'sass',                       github: 'nex3/sass', tag: '3.3.0.rc.1'
  gem 'sass-rails'
  gem 'compass', '~> 0.13.alpha.7', github: 'chriseppstein/compass'
  gem 'compass-rails',              github: 'Compass/compass-rails'
end

group :development do
  gem 'guard-livereload', require: false
  gem 'guard-compass',    require: false
  gem 'rack-livereload'
  gem 'rb-fsevent',       require: false
end

# Testing
group :development, :test do
  # Use sqlite3 as the database for Active Record
  gem 'sqlite3'
  gem 'rspec-rails'
  gem 'rspec-mocks'
  gem 'pry'
  gem 'timecop'

  # Rails panel
  gem 'meta_request'


  gem 'mock_redis'
end

# UI

gem 'ink2-rails', github: 'TigerWolf/ink2-rails', ref: 'ac5714356daa7091391924633c42a0cac3f0c43b'
gem 'font-awesome-rails'
gem 'haml'
gem 'select2-rails'


gem 'curb'

gem 'draper'
gem 'rollbar'

gem 'redis'
gem 'redis-namespace'

gem 'rails-perftest'
gem 'ruby-prof'

# Use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano', group: :development

# Use debugger
# gem 'debugger', group: [:development, :test]

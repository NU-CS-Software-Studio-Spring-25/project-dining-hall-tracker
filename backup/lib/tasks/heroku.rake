namespace :heroku do
  desc 'Tasks to be run on Heroku release phase'
  task :release => :environment do
    begin
      # Check if database exists and is accessible
      ActiveRecord::Base.connection
      # Run migrations if database is accessible
      Rake::Task['db:migrate'].invoke
    rescue ActiveRecord::NoDatabaseError, PG::ConnectionBad => e
      puts "Database error: #{e.message}"
      puts "Creating database..."
      Rake::Task['db:create'].invoke
      Rake::Task['db:migrate'].invoke
    end
  end
end 
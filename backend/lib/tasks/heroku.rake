namespace :heroku do
  desc 'Tasks to be run on Heroku release phase'
  task :release => :environment do
    # Run database migrations
    Rake::Task['db:migrate'].invoke
  end
end 
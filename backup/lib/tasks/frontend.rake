namespace :frontend do
  desc 'Build frontend assets'
  task :build do
    cd_cmd = "cd #{Rails.root.join('../frontend')}"
    build_cmd = "npm install && npm run build"
    copy_cmd = "cp -r dist/* #{Rails.root.join('public/')}"

    puts "Building frontend assets..."
    system("#{cd_cmd} && #{build_cmd}")
    system(copy_cmd)
    puts "Frontend assets built and copied to public folder."
  end
end 
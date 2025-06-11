class FrontendController < ApplicationController
  def index
    index_file = Rails.root.join('public', 'index.html')
    
    if File.exist?(index_file)
      render file: index_file, layout: false
    else
      render plain: "Frontend build not found. Please run the build process.", status: :not_found
    end
  rescue => e
    Rails.logger.error "Error serving frontend: #{e.message}"
    render plain: "Error loading application", status: :internal_server_error
  end
end 
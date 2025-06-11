class FrontendController < ApplicationController
  def index
    index_file = Rails.root.join('public', 'index.html')
    
    if File.exist?(index_file)
      # Read the file content and send it with proper content type
      html_content = File.read(index_file)
      render html: html_content.html_safe, layout: false, content_type: 'text/html'
    else
      render plain: "Frontend build not found. Please run the build process.", status: :not_found
    end
  rescue => e
    Rails.logger.error "Error serving frontend: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    render plain: "Error loading application", status: :internal_server_error
  end
end 
class FrontendController < ApplicationController
  def index
    render file: Rails.root.join('public', 'dist', 'index.html')
  end
end 
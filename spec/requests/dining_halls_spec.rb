require 'rails_helper'

RSpec.describe "DiningHalls", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get "/dining_halls/index"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /show" do
    it "returns http success" do
      get "/dining_halls/show"
      expect(response).to have_http_status(:success)
    end
  end

end

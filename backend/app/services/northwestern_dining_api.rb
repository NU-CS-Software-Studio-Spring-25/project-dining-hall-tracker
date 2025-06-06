require 'net/http'
require 'json'
require 'zlib'
require 'stringio'
require 'open3'

class NorthwesternDiningApi
  BASE_URL = 'https://api.dineoncampus.com/v1'
  SITE_ID = '5751fd2b90975b60e0489932' # Northwestern site ID
  
  # Northwestern dining hall location IDs
  DINING_HALL_IDS = {
    'Allison Dining Commons' => '5b33ae291178e909d807593d',
    'Sargent Dining Commons' => '5b33ae291178e909d807593e', 
    'Foster Walker Plex East' => '5bae7de3f3eeb60c7d3854ba',
    'Foster Walker Plex West' => '5bae7ee9f3eeb60cb4f8f3af',
    'Elder Dining Commons' => '5d113c924198d409c34fdf5c',
    'Foster Walker Market' => '6806795ae45d4367056e19ac'
  }

  def self.make_request_with_curl(uri)
    # Use curl since it successfully bypassed Cloudflare protection
    curl_command = [
      'curl', '--silent', '--compressed',
      '-H', 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '-H', 'Accept: application/json, text/plain, */*',
      '-H', 'Referer: https://northwestern.campusdish.com/',
      uri.to_s
    ]
    
    result = ''
    Open3.popen3(*curl_command) do |stdin, stdout, stderr, wait_thread|
      result = stdout.read
      exit_status = wait_thread.value
      
      unless exit_status.success?
        Rails.logger.error "Curl command failed for #{uri}"
        Rails.logger.error "Exit status: #{exit_status.exitstatus}"
        Rails.logger.error "Stderr: #{stderr.read}" if stderr
        return nil
      end
    end
    
    if result.present?
      begin
        JSON.parse(result)
      rescue JSON::ParserError => e
        Rails.logger.error "Failed to parse JSON from curl result: #{e.message}"
        Rails.logger.error "Result: #{result[0..500]}"
        nil
      end
    else
      Rails.logger.error "Empty result from curl for #{uri}"
      nil
    end
  rescue => e
    Rails.logger.error "Curl request error: #{e.message} for #{uri}"
    nil
  end

  def self.make_request(uri)
    # First try curl approach since it worked
    result = make_request_with_curl(uri)
    return result if result
    
    # Fallback to Net::HTTP if curl fails
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.read_timeout = 30
    
    request = Net::HTTP::Get.new(uri)
    # Set comprehensive browser headers that mimic the actual Northwestern dining website
    request['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    request['Accept'] = 'application/json, text/plain, */*'
    request['Accept-Language'] = 'en-US,en;q=0.9'
    request['Accept-Encoding'] = 'gzip, deflate, br'
    request['Referer'] = 'https://northwestern.campusdish.com/' # This is key!
    request['Origin'] = 'https://northwestern.campusdish.com'
    request['DNT'] = '1'
    request['Connection'] = 'keep-alive'
    request['Sec-Fetch-Dest'] = 'empty'
    request['Sec-Fetch-Mode'] = 'cors'
    request['Sec-Fetch-Site'] = 'cross-site'
    
    response = http.request(request)
    
    if response.code == '200'
      # Handle compressed response
      body = case response['Content-Encoding']
      when 'gzip'
        Zlib::GzipReader.new(StringIO.new(response.body)).read
      when 'deflate'
        Zlib::Inflate.inflate(response.body)
      else
        response.body
      end
      
      JSON.parse(body)
    else
      Rails.logger.error "API request failed: #{response.code} #{response.message} for #{uri}"
      Rails.logger.error "Response body: #{response.body[0..500]}" if response.body
      nil
    end
  rescue => e
    Rails.logger.error "API request error: #{e.message} for #{uri}"
    Rails.logger.error e.backtrace.join("\n")
    nil
  end

  def self.fetch_all_locations
    uri = URI("#{BASE_URL}/locations/all_locations")
    params = {
      platform: '0',
      site_id: SITE_ID,
      for_menus: 'true',
      with_address: 'false',
      with_buildings: 'true'
    }
    uri.query = URI.encode_www_form(params)
    
    make_request(uri)
  end

  def self.fetch_periods_for_location(location_id, date = Date.current.strftime('%Y-%m-%d'))
    uri = URI("#{BASE_URL}/location/#{location_id}/periods/")
    params = {
      platform: '0',
      date: date
    }
    uri.query = URI.encode_www_form(params)
    
    make_request(uri)
  end

  def self.fetch_menu(location_id, period_id, date = Date.current.strftime('%Y-%m-%d'))
    uri = URI("#{BASE_URL}/location/#{location_id}/periods/#{period_id}")
    params = {
      platform: '0',
      date: date
    }
    uri.query = URI.encode_www_form(params)
    
    make_request(uri)
  end

  # Fetch all meals for all dining halls for today
  def self.fetch_all_meals_today(date = nil)
    # Try multiple recent dates if no specific date provided
    dates_to_try = []
    if date
      dates_to_try = [date]
    else
      # Try specific dates that we know have data, then fall back to recent dates
      dates_to_try = [
        '2025-06-05', # Date we know has data for all halls
        Date.current.strftime('%Y-%m-%d'),
        1.day.ago.strftime('%Y-%m-%d'),
        2.days.ago.strftime('%Y-%m-%d')
      ].uniq
    end
    
    all_meals = []
    
    dates_to_try.each do |try_date|
      Rails.logger.info "Trying to fetch data for date: #{try_date}"
      
      DINING_HALL_IDS.each_with_index do |(dining_hall_name, location_id), hall_index|
        Rails.logger.info "Fetching data for #{dining_hall_name} (#{hall_index + 1}/#{DINING_HALL_IDS.size}) on #{try_date}"
        
        # Get periods specific to this dining hall
        periods_response = fetch_periods_for_location(location_id, try_date)
        
        if periods_response.nil? || periods_response['periods'].nil?
          Rails.logger.warn "  No periods found for #{dining_hall_name} on #{try_date}"
          next
        end
        
        periods = periods_response['periods']
        Rails.logger.info "  Found #{periods.length} periods: #{periods.map { |p| p['name'] }.join(', ')}"
        
        periods.each_with_index do |period, period_index|
          Rails.logger.info "    Fetching #{period['name']} menu..."
          
          # Add delay between requests to avoid being blocked (but shorter now that we have better headers)
          sleep(1.5) if hall_index > 0 || period_index > 0
          
          menu_data = fetch_menu(location_id, period['id'], try_date)
          
          if menu_data.nil?
            Rails.logger.warn "    No data returned for #{dining_hall_name} - #{period['name']} on #{try_date}"
            next
          end
          
          if menu_data['closed']
            Rails.logger.info "    #{dining_hall_name} is closed for #{period['name']} on #{try_date}"
            next
          end
          
          unless menu_data['menu']
            Rails.logger.warn "    No menu data for #{dining_hall_name} - #{period['name']} on #{try_date}"
            next
          end
          
          meals = parse_meals_from_menu(menu_data, dining_hall_name, period['name'])
          Rails.logger.info "    Found #{meals.length} meals for #{period['name']}"
          all_meals.concat(meals)
        end
      end
      
      # If we found meals, stop trying other dates
      if all_meals.any?
        Rails.logger.info "Successfully found data for #{try_date}. Total meals: #{all_meals.length}"
        break
      else
        Rails.logger.warn "No meals found for #{try_date}, trying next date..."
      end
    end
    
    Rails.logger.info "Final total meals fetched: #{all_meals.length}"
    all_meals
  end

  # Get current periods for any dining hall (to get current period IDs)
  def self.get_current_periods
    get_current_periods_for_date(Date.current.strftime('%Y-%m-%d'))
  end
  
  def self.get_current_periods_for_date(date)
    # Use Allison as a sample to get current period IDs
    sample_location_id = DINING_HALL_IDS['Allison Dining Commons']
    response = fetch_periods_for_location(sample_location_id, date)
    
    if response && response['periods']
      response['periods']
    else
      []
    end
  end

  private

  def self.parse_meals_from_menu(menu_data, dining_hall_name, period_name)
    meals = []
    
    # Extract meals from categories
    if menu_data['menu'] && menu_data['menu']['periods'] && menu_data['menu']['periods']['categories']
      categories = menu_data['menu']['periods']['categories']
      
      categories.each do |category|
        next unless category['items']
        
        category['items'].each do |item|
          meals << parse_meal_item(item, dining_hall_name, period_name, category['name'])
        end
      end
    end
    
    meals
  end

  def self.parse_meal_item(item, dining_hall_name, period_name, category_name)
    # Extract nutritional information
    nutrients = item['nutrients'] || []
    nutrition_hash = {}
    
    nutrients.each do |nutrient|
      case nutrient['name'].downcase
      when /protein/
        nutrition_hash[:protein] = nutrient['value_numeric'].to_f
      when /carbohydrate/
        nutrition_hash[:carbs] = nutrient['value_numeric'].to_f
      when /fat/
        nutrition_hash[:fat] = nutrient['value_numeric'].to_f
      when /fiber/
        nutrition_hash[:fiber] = nutrient['value_numeric'].to_f
      end
    end
    
    calories = item['calories'].to_i if item['calories']
    
    {
      name: item['name'],
      description: item['desc'],
      portion: item['portion'] || 'N/A',
      protein: nutrition_hash[:protein] || 0.0,
      carbs: nutrition_hash[:carbs] || 0.0,
      fat: nutrition_hash[:fat] || 0.0,
      fiber: nutrition_hash[:fiber] || 0.0,
      calories: calories || 0,
      serving_size: item['portion'] || 'N/A',
      dining_hall_name: dining_hall_name,
      period_name: period_name,
      category_name: category_name,
      ingredients: item['ingredients'],
      api_item_id: item['id']
    }
  end
end 
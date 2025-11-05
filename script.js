// Weather App JavaScript - Complete Implementation
// API Configuration - Using Open-Meteo (Free, No API Key Required!)
const API_CONFIG = {
    // Open-Meteo API - Completely FREE, no registration needed!
    BASE_URL: 'https://api.open-meteo.com/v1/forecast',
    GEO_URL: 'https://geocoding-api.open-meteo.com/v1/search',
    TIMEZONE_URL: 'https://api.open-meteo.com/v1/forecast'
};

// Global Variables
let currentUnits = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
let currentLocationData = null;
let forecastData = null;
let searchTimeout = null;

// Weather condition mappings for dynamic backgrounds
const WEATHER_BACKGROUNDS = {
    0: 'clear',      // Clear sky
    1: 'clear',      // Mainly clear
    2: 'cloudy',     // Partly cloudy
    3: 'cloudy',     // Overcast
    45: 'cloudy',    // Fog
    48: 'cloudy',    // Depositing rime fog
    51: 'rainy',     // Light drizzle
    53: 'rainy',     // Moderate drizzle
    55: 'rainy',     // Dense drizzle
    61: 'rainy',     // Slight rain
    63: 'rainy',     // Moderate rain
    65: 'rainy',     // Heavy rain
    71: 'snow',      // Slight snow fall
    73: 'snow',      // Moderate snow fall
    75: 'snow',      // Heavy snow fall
    80: 'rainy',     // Slight rain showers
    81: 'rainy',     // Moderate rain showers
    82: 'rainy',     // Violent rain showers
    85: 'snow',      // Slight snow showers
    86: 'snow',      // Heavy snow showers
    95: 'rainy',     // Thunderstorm
    96: 'rainy',     // Thunderstorm with slight hail
    99: 'rainy'      // Thunderstorm with heavy hail
};

// Weather code descriptions
const WEATHER_DESCRIPTIONS = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
};

// Weather code to icon mapping
const WEATHER_ICONS = {
    0: '☀️',    // Clear sky
    1: '🌤️',    // Mainly clear
    2: '⛅',    // Partly cloudy
    3: '☁️',    // Overcast
    45: '🌫️',   // Fog
    48: '🌫️',   // Depositing rime fog
    51: '🌧️',   // Light drizzle
    53: '🌧️',   // Moderate drizzle
    55: '🌧️',   // Dense drizzle
    61: '🌧️',   // Slight rain
    63: '🌧️',   // Moderate rain
    65: '🌧️',   // Heavy rain
    71: '🌨️',   // Slight snow
    73: '🌨️',   // Moderate snow
    75: '❄️',   // Heavy snow
    80: '🌦️',   // Rain showers
    81: '🌦️',   // Moderate rain showers
    82: '⛈️',   // Violent rain showers
    85: '🌨️',   // Snow showers
    86: '❄️',   // Heavy snow showers
    95: '⛈️',   // Thunderstorm
    96: '⛈️',   // Thunderstorm with hail
    99: '⛈️'    // Thunderstorm with heavy hail
};

// City timezone offsets (in hours from UTC)
// Comprehensive city timezone offsets (in hours from UTC)
const CITY_TIMEZONES = {
    // Afghanistan
    'Kabul': 4.5,
    // Albania
    'Tirana': 1,
    // Algeria
    'Algiers': 1,
    // Andorra
    'Andorra La Vella': 1,
    // Angola
    'Luanda': 1,
    // Antigua and Barbuda
    "Saint John's": -4,
    // Argentina
    'Buenos Aires': -3,
    // Armenia
    'Yerevan': 4,
    // Aruba
    'Oranjestad': -4,
    // Australia
    'Canberra': 11,
    // Austria
    'Vienna': 1,
    // Azerbaijan
    'Baku': 4,
    // Bahamas
    'Nassau': -5,
    // Bahrain
    'Manama': 3,
    // Bangladesh
    'Dhaka': 6,
    // Barbados
    'Bridgetown': -4,
    // Belarus
    'Minsk': 3,
    // Belgium
    'Brussels': 1,
    // Belize
    'Belmopan': -6,
    // Benin
    'Porto Novo': 1,
    // Bermuda
    'Hamilton': -4,
    // Bhutan
    'Thimphu': 6,
    // Bolivia
    'Sucre': -4,
    // Bosnia-Herzegovina
    'Sarajevo': 1,
    // Botswana
    'Gaborone': 2,
    // Brazil
    'Brasilia': -3,
    // British Virgin Islands
    'Road Town': -4,
    // Brunei
    'Bandar Seri Begawan': 8,
    // Bulgaria
    'Sofia': 2,
    // Burkina Faso
    'Ouagadougou': 0,
    // Burundi
    'Gitega': 2,
    // Cabo Verde
    'Praia': -1,
    // Cambodia
    'Phnom Penh': 7,
    // Cameroon
    'Yaoundé': 1,
    // Canada
    'Ottawa': -5,
    // Cayman Islands
    'George Town': -5,
    // Central African Republic
    'Bangui': 1,
    // Chad
    "N'Djamena": 1,
    // Chile
    'Santiago': -3,
    // China
    'Beijing': 8,
    // Colombia
    'Bogota': -5,
    // Comoros
    'Moroni': 3,
    // Congo
    'Brazzaville': 1,
    // Congo Dem. Rep.
    'Kinshasa': 1,
    // Cook Islands
    'Rarotonga': -10,
    // Costa Rica
    'San Jose': -6,
    // Cote d\'Ivoire
    'Yamoussoukro': 0,
    // Croatia
    'Zagreb': 1,
    // Cuba
    'Havana': -5,
    // Cyprus
    'Nicosia': 2,
    // Cyprus, Northern
    'North Nicosia': 2,
    // Czechia
    'Prague': 1,
    // Denmark
    'Copenhagen': 1,
    // Djibouti
    'Djibouti': 3,
    // Dominica
    'Roseau': -4,
    // Dominican Republic
    'Santo Domingo': -4,
    // Ecuador
    'Quito': -5,
    // Egypt
    'Cairo': 2,
    // El Salvador
    'San Salvador': -6,
    // Equatorial Guinea
    'Malabo': 1,
    // Eritrea
    'Asmara': 3,
    // Estonia
    'Tallinn': 2,
    // Eswatini
    'Mbabane': 2,
    // Ethiopia
    'Addis Ababa': 3,
    // Falkland Islands
    'Stanley': -3,
    // Fiji
    'Suva': 12,
    // Finland
    'Helsinki': 2,
    // France
    'Paris': 1,
    // Gabon
    'Libreville': 1,
    // Gambia
    'Banjul': 0,
    // Georgia
    'Tbilisi': 4,
    // Germany
    'Berlin': 1,
    // Ghana
    'Accra': 0,
    // Gibraltar
    'Gibraltar': 1,
    // Greece
    'Athens': 2,
    // Greenland
    'Nuuk': -2,
    // Grenada
    "Saint George's": -4,
    // Guatemala
    'Guatemala City': -6,
    // Guinea
    'Conakry': 0,
    // Guinea-Bissau
    'Bissau': 0,
    // Guyana
    'Georgetown': -4,
    // Haiti
    'Port-au-Prince': -5,
    // Honduras
    'Tegucigalpa': -6,
    // Hungary
    'Budapest': 1,
    // Iceland
    'Reykjavik': 0,
    // India
    'New Delhi': 5.5,
    // Indonesia
    'Jakarta': 7,
    // Iran
    'Tehran': 3.5,
    // Iraq
    'Baghdad': 3,
    // Ireland
    'Dublin': 0,
    // Isle of Man
    'Douglas': 0,
    // Israel
    'Jerusalem': 2,
    // Italy
    'Rome': 1,
    // Jamaica
    'Kingston': -5,
    // Japan
    'Tokyo': 9,
    // Jordan
    'Amman': 3,
    // Kazakhstan
    'Astana': 5,
    // Kenya
    'Nairobi': 3,
    // Kiribati
    'Tarawa': 12,
    // Kosovo
    'Pristina': 1,
    // Kuwait
    'Kuwait City': 3,
    // Kyrgyzstan
    'Bishkek': 6,
    // Laos
    'Vientiane': 7,
    // Latvia
    'Riga': 2,
    // Lebanon
    'Beirut': 2,
    // Lesotho
    'Maseru': 2,
    // Liberia
    'Monrovia': 0,
    // Libya
    'Tripoli': 2,
    // Liechtenstein
    'Vaduz': 1,
    // Lithuania
    'Vilnius': 2,
    // Luxembourg
    'Luxembourg': 1,
    // Madagascar
    'Antananarivo': 3,
    // Malawi
    'Lilongwe': 2,
    // Malaysia
    'Kuala Lumpur': 8,
    // Maldives
    'Male': 5,
    // Mali
    'Bamako': 0,
    // Malta
    'Valletta': 1,
    // Marshall Islands
    'Majuro': 12,
    // Mauritania
    'Nouakchott': 0,
    // Mauritius
    'Port Louis': 4,
    // Mexico
    'Mexico City': -6,
    // Micronesia
    'Palikir': 11,
    // Moldova
    'Chișinău': 2,
    // Monaco
    'Monaco': 1,
    // Mongolia
    'Ulaanbaatar': 8,
    // Montenegro
    'Podgorica': 1,
    // Montserrat
    'Brades': -4,
    // Morocco
    'Rabat': 1,
    // Mozambique
    'Maputo': 2,
    // Myanmar
    'Naypyidaw': 6.5,
    // Namibia
    'Windhoek': 2,
    // Nauru
    'Yaren': 12,
    // Nepal
    'Kathmandu': 5.75,
    // Netherlands
    'Amsterdam': 1,
    // New Zealand
    'Wellington': 13,
    // Nicaragua
    'Managua': -6,
    // Niger
    'Niamey': 1,
    // Nigeria
    'Abuja': 1,
    // Niue
    'Alofi': -11,
    // North Korea
    'Pyongyang': 9,
    // North Macedonia
    'Skopje': 1,
    // Norway
    'Oslo': 1,
    // Oman
    'Muscat': 4,
    // Pakistan
    'Islamabad': 5,
    // Palau
    'Ngerulmud': 9,
    // Panama
    'Panama': -5,
    // Papua New Guinea
    'Port Moresby': 10,
    // Paraguay
    'Asuncion': -3,
    // Peru
    'Lima': -5,
    // Philippines
    'Manila': 8,
    // Pitcairn Islands
    'Adamstown': -8,
    // Poland
    'Warsaw': 1,
    // Portugal
    'Lisbon': 0,
    // Puerto Rico
    'San Juan': -4,
    // Qatar
    'Doha': 3,
    // Réunion
    'Saint-Denis': 4,
    // Romania
    'Bucharest': 2,
    // Russia
    'Moscow': 3,
    // Rwanda
    'Kigali': 2,
    // Saint Helena
    'Jamestown': 0,
    // Saint Kitts and Nevis
    'Basseterre': -4,
    // Saint Lucia
    'Castries': -4,
    // Saint Vincent and Grenadines
    'Kingstown': -4,
    // Samoa
    'Apia': 13,
    // San Marino
    'San Marino': 1,
    // Sao Tome and Principe
    'São Tomé': 0,
    // Saudi Arabia
    'Riyadh': 3,
    // Senegal
    'Dakar': 0,
    // Serbia
    'Belgrade': 1,
    // Seychelles
    'Victoria': 4,
    // Sierra Leone
    'Freetown': 0,
    // Singapore
    'Singapore': 8,
    // Slovakia
    'Bratislava': 1,
    // Slovenia
    'Ljubljana': 1,
    // Solomon Islands
    'Gizo': 11,
    'Honiara': 11,
    // Somalia
    'Mogadishu': 3,
    // South Africa
    'Pretoria': 2,
    // South Georgia
    'King Edward Point': -2,
    // South Korea
    'Seoul': 9,
    // South Sudan
    'Juba': 2,
    // Spain
    'Madrid': 1,
    // Sri Lanka
    'Sri Jayawardenepura Kotte': 5.5,
    // Sudan
    'Khartoum': 2,
    // Suriname
    'Paramaribo': -3,
    // Sweden
    'Stockholm': 1,
    // Switzerland
    'Bern': 1,
    // Syria
    'Damascus': 3,
    // Taiwan
    'Taipei': 8,
    // Tajikistan
    'Dushanbe': 5,
    // Tanzania
    'Dodoma': 3,
    // Thailand
    'Bangkok': 7,
    // Timor-Leste
    'Dili': 9,
    // Togo
    'Lomé': 0,
    // Tonga
    "Nuku'alofa": 13,
    // Trinidad and Tobago
    'Port of Spain': -4,
    // Tunisia
    'Tunis': 1,
    // Turkey
    'Ankara': 3,
    // Turkmenistan
    'Ashgabat': 5,
    // Turks and Caicos Islands
    'Cockburn Town': -5,
    // Tuvalu
    'Funafuti': 12,
    // Uganda
    'Kampala': 3,
    // Ukraine
    'Kyiv': 2,
    // United Arab Emirates
    'Abu Dhabi': 4,
    // United Kingdom
    'London': 0,
    // Uruguay
    'Montevideo': -3,
    // USA
    'Washington DC': -5,
    'New York': -5,
    // Uzbekistan
    'Tashkent': 5,
    // Vanuatu
    'Port Vila': 11,
    // Vatican City
    'Vatican City': 1,
    // Venezuela
    'Caracas': -4,
    // Vietnam
    'Hanoi': 7,
    // Yemen
    'Sana': 3,
    // Zambia
    'Lusaka': 2,
    // Zimbabwe
    'Harare': 2
};

// DOM Elements
const elements = {
    loadingScreen: document.getElementById('loadingScreen'),
    weatherApp: document.getElementById('weatherApp'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    locationBtn: document.getElementById('locationBtn'),
    unitsToggle: document.getElementById('unitsToggle'),
    cityName: document.getElementById('cityName'),
    countryName: document.getElementById('countryName'),
    currentTime: document.getElementById('currentTime'),
    mainTemp: document.getElementById('mainTemp'),
    weatherIcon: document.getElementById('weatherIcon'),
    weatherDescription: document.getElementById('weatherDescription'),
    highTemp: document.getElementById('highTemp'),
    lowTemp: document.getElementById('lowTemp'),
    visibility: document.getElementById('visibility'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    feelsLike: document.getElementById('feelsLike'),
    pressure: document.getElementById('pressure'),
    uvIndex: document.getElementById('uvIndex'),
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    lastUpdated: document.getElementById('lastUpdated'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    errorModal: document.getElementById('errorModal'),
    errorMessage: document.getElementById('errorMessage'),
    retryBtn: document.getElementById('retryBtn'),
    closeErrorBtn: document.getElementById('closeErrorBtn'),
    weatherParticles: document.getElementById('weatherParticles')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// App initialization
async function initializeApp() {
    try {
        // Setup event listeners
        setupEventListeners();
        
        // Try to get user's location, fallback to default city (New York)
        try {
            await getUserLocation();
        } catch (error) {
            console.log('Geolocation not available, loading New York weather...');
            // Load New York as default city
            await getWeatherByCoordinates(40.7128, -74.0060);
        }
        
    } catch (error) {
        console.error('App initialization failed:', error);
        showError('Failed to initialize the weather app. Please refresh and try again.');
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.searchInput.addEventListener('keypress', handleSearchKeyPress);
    elements.searchBtn.addEventListener('click', handleSearch);
    
    // Location and units buttons
    elements.locationBtn.addEventListener('click', getUserLocation);
    elements.unitsToggle.addEventListener('click', toggleUnits);
    
    // Error modal
    elements.retryBtn.addEventListener('click', retryWeatherUpdate);
    elements.closeErrorBtn.addEventListener('click', closeErrorModal);
    
    // Click outside modal to close
    elements.errorModal.addEventListener('click', (e) => {
        if (e.target === elements.errorModal) {
            closeErrorModal();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Handle online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);
}

// Get user's current location
async function getUserLocation() {
    showLoading();
    
    if (!navigator.geolocation) {
        console.log('Geolocation not supported, using default location');
        await getWeatherByCity('London');
        return;
    }
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes cache
    };
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            await getWeatherByCoordinates(latitude, longitude);
        },
        async (error) => {
            console.error('Geolocation error:', error);
            // Fallback to default city
            await getWeatherByCity('London');
        },
        options
    );
}

// Fetch weather data by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        showLoading();
        
        // Fetch weather data from Open-Meteo API
        const weatherData = await fetchWeatherData(lat, lon);
        
        updateWeatherDisplay(weatherData);
        hideLoading();
        
    } catch (error) {
        console.error('Failed to fetch weather by coordinates:', error);
        showError('Failed to get weather for your location. Please try searching for a city.');
        hideLoading();
    }
}

// Fetch weather data by city name
async function getWeatherByCity(cityName) {
    try {
        showLoading();
        
        // First, geocode the city name to get coordinates
        const geoData = await geocodeCity(cityName);
        
        if (!geoData || geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { latitude, longitude, name, country } = geoData[0];
        
        // Fetch weather data using coordinates
        const weatherData = await fetchWeatherData(latitude, longitude, name, country);
        
        updateWeatherDisplay(weatherData);
        hideLoading();
        
    } catch (error) {
        console.error('Failed to fetch weather for city:', error);
        showError(`Failed to get weather for "${cityName}". Please check the city name and try again.`);
        hideLoading();
    }
}

// Geocode city name to coordinates
async function geocodeCity(cityName) {
    const url = `${API_CONFIG.GEO_URL}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
}

// Fetch weather data from Open-Meteo API
async function fetchWeatherData(lat, lon, cityName = null, country = null) {
    const url = `${API_CONFIG.BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // If city name wasn't provided, get it from reverse geocoding
    if (!cityName) {
        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`;
        try {
            const geoResponse = await fetch(geoUrl, {
                headers: {
                    'User-Agent': 'WeatherWiseApp/1.0'
                }
            });
            const geoData = await geoResponse.json();
            if (geoData.address) {
                cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || 'Unknown Location';
                country = geoData.address.country || '';
            }
        } catch (e) {
            console.error('Reverse geocoding failed:', e);
            cityName = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
        }
    }
    
    // Add location information to the data
    data.location = {
        name: cityName || 'Unknown',
        country: country || '',
        latitude: lat,
        longitude: lon
    };
    
    return data;
}

// Update weather display with fetched data
function updateWeatherDisplay(weatherData) {
    try {
        currentLocationData = weatherData;
        
        // Update current weather
        updateCurrentWeatherUI(weatherData);
        
        // Update forecasts
        updateHourlyForecast(weatherData);
        updateDailyForecast(weatherData);
        
        // Update dynamic background
        updateDynamicBackground(weatherData);
        
        // Update weather particles
        updateWeatherParticles(weatherData);
        
        // Update last updated time
        elements.lastUpdated.textContent = new Date().toLocaleTimeString();
        
    } catch (error) {
        console.error('Failed to update weather display:', error);
        showError('Failed to display weather data. Please try again.');
    }
}

// Update current weather UI elements
function updateCurrentWeatherUI(data) {
    const tempSymbol = currentUnits === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnits === 'metric' ? 'km/h' : 'mph';
    
    // Current weather data
    const current = data.current;
    const daily = data.daily;
    
    // Get weather code and description
    const weatherCode = current.weather_code;
    const description = WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown';
    const icon = WEATHER_ICONS[weatherCode] || '🌡️';
    
    // Location and basic info
    elements.cityName.textContent = data.location.name;
    elements.countryName.textContent = data.location.country;
    
    // Display location's current time
    updateLocationCurrentTime(data);
    
    // Convert temperature if needed
    let temp = current.temperature_2m;
    let feelsLike = current.apparent_temperature;
    let maxTemp = daily.temperature_2m_max[0];
    let minTemp = daily.temperature_2m_min[0];
    
    if (currentUnits === 'imperial') {
        temp = (temp * 9/5) + 32;
        feelsLike = (feelsLike * 9/5) + 32;
        maxTemp = (maxTemp * 9/5) + 32;
        minTemp = (minTemp * 9/5) + 32;
    }
    
    // Main weather data
    elements.mainTemp.textContent = `${Math.round(temp)}°`;
    elements.weatherDescription.textContent = description;
    
    // Display weather icon (remove all previous icons first)
    const iconContainer = elements.weatherIcon.parentNode;
    const oldIcons = iconContainer.querySelectorAll('.weather-icon');
    oldIcons.forEach(oldIcon => {
        if (oldIcon !== elements.weatherIcon) {
            oldIcon.remove();
        }
    });
    
    // Hide the img element and create one icon div
    elements.weatherIcon.style.display = 'none';
    const iconElement = document.createElement('div');
    iconElement.style.fontSize = '120px';
    iconElement.textContent = icon;
    iconElement.className = 'weather-icon';
    iconContainer.insertBefore(iconElement, elements.weatherIcon);
    
    // Temperature range
    elements.highTemp.textContent = `${Math.round(maxTemp)}°`;
    elements.lowTemp.textContent = `${Math.round(minTemp)}°`;
    
    // Weather details
    elements.visibility.textContent = 'N/A'; // Not provided by Open-Meteo in current weather
    elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    
    let windSpeed = current.wind_speed_10m;
    if (currentUnits === 'imperial') {
        windSpeed = windSpeed * 0.621371; // Convert km/h to mph
    }
    elements.windSpeed.textContent = `${Math.round(windSpeed)} ${speedUnit}`;
    elements.feelsLike.textContent = `${Math.round(feelsLike)}${tempSymbol}`;
    elements.pressure.textContent = `${Math.round(current.pressure_msl)} hPa`;
    
    // UV Index
    elements.uvIndex.textContent = daily.uv_index_max[0] || 'N/A';
    
    // Sunrise and sunset
    if (daily.sunrise && daily.sunrise[0]) {
        const sunrise = new Date(daily.sunrise[0]);
        const sunset = new Date(daily.sunset[0]);
        elements.sunrise.textContent = sunrise.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        elements.sunset.textContent = sunset.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
}

// Update hourly forecast
function updateHourlyForecast(weatherData) {
    elements.hourlyForecast.innerHTML = '';
    
    const hourly = weatherData.hourly;
    
    // Find the current hour index in the data
    const now = new Date();
    let currentIndex = 0;
    
    for (let i = 0; i < hourly.time.length; i++) {
        const hourTime = new Date(hourly.time[i]);
        if (hourTime >= now) {
            currentIndex = i;
            break;
        }
    }
    
    // Display next 24 hours from current time
    for (let i = 0; i < 24 && (currentIndex + i) < hourly.time.length; i++) {
        const hourlyItem = createHourlyForecastItem(hourly, currentIndex + i, i === 0);
        elements.hourlyForecast.appendChild(hourlyItem);
    }
}

// Create hourly forecast item element
function createHourlyForecastItem(hourly, index, isNow = false) {
    const item = document.createElement('div');
    item.className = 'hourly-item';
    
    const time = new Date(hourly.time[index]);
    
    let temp = hourly.temperature_2m[index];
    if (currentUnits === 'imperial') {
        temp = (temp * 9/5) + 32;
    }
    
    const weatherCode = hourly.weather_code[index];
    const icon = WEATHER_ICONS[weatherCode] || '🌡️';
    const desc = WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown';
    
    item.innerHTML = `
        <div class="hourly-time">${isNow ? 'Now' : formatHourTime(time)}</div>
        <div style="font-size: 48px;">${icon}</div>
        <div class="hourly-temp">${Math.round(temp)}°</div>
        <div class="hourly-desc">${desc.split(' ')[0]}</div>
    `;
    
    return item;
}

// Update daily forecast
function updateDailyForecast(weatherData) {
    elements.dailyForecast.innerHTML = '';
    
    const daily = weatherData.daily;
    const daysToShow = Math.min(7, daily.time.length);
    
    for (let i = 0; i < daysToShow; i++) {
        const dailyItem = createDailyForecastItem(daily, i);
        elements.dailyForecast.appendChild(dailyItem);
    }
}

// Create daily forecast item element
function createDailyForecastItem(daily, index) {
    const item = document.createElement('div');
    item.className = 'daily-item';
    
    const date = new Date(daily.time[index]);
    const isToday = index === 0;
    
    const dayName = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' });
    const dateText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    let maxTemp = daily.temperature_2m_max[index];
    let minTemp = daily.temperature_2m_min[index];
    
    if (currentUnits === 'imperial') {
        maxTemp = (maxTemp * 9/5) + 32;
        minTemp = (minTemp * 9/5) + 32;
    }
    
    const weatherCode = daily.weather_code[index];
    const icon = WEATHER_ICONS[weatherCode] || '🌡️';
    const desc = WEATHER_DESCRIPTIONS[weatherCode] || 'Unknown';
    
    item.innerHTML = `
        <div class="daily-date">
            <div>
                <div class="daily-day">${dayName}</div>
                <div class="daily-date-text">${dateText}</div>
            </div>
        </div>
        <div style="font-size: 48px;">${icon}</div>
        <div class="daily-desc">${desc}</div>
        <div class="daily-temps">
            <span class="daily-high">${Math.round(maxTemp)}°</span>
            <span class="daily-low">${Math.round(minTemp)}°</span>
        </div>
    `;
    
    return item;
}

// Update dynamic background based on weather conditions and time of day
function updateDynamicBackground(weatherData) {
    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;
    
    // Get current hour from the data
    const currentTime = new Date(weatherData.current.time);
    const hour = currentTime.getHours();
    
    // Remove all existing classes
    document.body.classList.remove(
        'sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy', 'clear',
        'sunrise', 'morning', 'afternoon', 'sunset', 'evening', 'night'
    );
    
    // Determine time of day
    let timeClass = '';
    if (!isDay) {
        timeClass = 'night';
    } else if (hour >= 5 && hour < 7) {
        timeClass = 'sunrise';
    } else if (hour >= 7 && hour < 12) {
        timeClass = 'morning';
    } else if (hour >= 12 && hour < 17) {
        timeClass = 'afternoon';
    } else if (hour >= 17 && hour < 19) {
        timeClass = 'sunset';
    } else if (hour >= 19 && hour < 21) {
        timeClass = 'evening';
    } else {
        timeClass = 'night';
    }
    
    // Determine weather condition
    let weatherClass = '';
    if ([95, 96, 99].includes(weatherCode)) {
        weatherClass = 'stormy'; // Thunderstorm
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        weatherClass = 'snowy'; // Snow
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        weatherClass = 'rainy'; // Rain
    } else if ([45, 48].includes(weatherCode)) {
        weatherClass = 'foggy'; // Fog
    } else if ([2, 3].includes(weatherCode)) {
        weatherClass = 'cloudy'; // Cloudy
    } else if ([0, 1].includes(weatherCode)) {
        weatherClass = 'sunny'; // Clear/Sunny
    } else {
        weatherClass = 'clear';
    }
    
    // Apply both time and weather classes
    document.body.classList.add(timeClass);
    if (weatherClass !== 'sunny' && weatherClass !== 'clear') {
        document.body.classList.add(weatherClass);
    } else if (isDay) {
        document.body.classList.add(weatherClass);
    }
}

// Update weather particles for animation effects
function updateWeatherParticles(weatherData) {
    const weatherCode = weatherData.current.weather_code;
    const isDay = weatherData.current.is_day === 1;
    const windSpeed = weatherData.current.wind_speed_10m || 0;
    
    elements.weatherParticles.innerHTML = '';
    
    // Thunderstorm - Lightning, rain, and dark clouds
    if ([95, 96, 99].includes(weatherCode)) {
        createLightningFlash();
        createRainParticles(100, true); // Heavy rain
        createCloudParticles(10);
    } 
    // Heavy Rain - Rain and clouds
    else if ([63, 65, 82].includes(weatherCode)) {
        createRainParticles(80);
        createCloudParticles(8);
    }
    // Light/Moderate Rain
    else if ([51, 53, 55, 61, 80, 81].includes(weatherCode)) {
        createRainParticles(50);
        createCloudParticles(5);
    }
    // Heavy Snow
    else if ([73, 75, 86].includes(weatherCode)) {
        createSnowParticles(60);
        createCloudParticles(8);
    }
    // Light Snow
    else if ([71, 77, 85].includes(weatherCode)) {
        createSnowParticles(40);
        createCloudParticles(5);
    }
    // Fog
    else if ([45, 48].includes(weatherCode)) {
        createFogParticles(15);
    }
    // Cloudy
    else if ([2, 3].includes(weatherCode)) {
        createCloudParticles(6);
    }
    // Clear/Sunny - Sun rays during day, stars at night
    else if ([0, 1].includes(weatherCode)) {
        if (isDay) {
            createSunRays();
        } else {
            createStars(50);
            createMoon();
        }
    }
    
    // Add wind effect if windy (>20 km/h)
    if (windSpeed > 20) {
        createWindParticles(20);
    }
}

// Create rain animation particles
function createRainParticles(count = 50, heavy = false) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'rain-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = heavy 
            ? (Math.random() * 0.3 + 0.3) + 's' 
            : (Math.random() * 0.5 + 0.5) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        elements.weatherParticles.appendChild(particle);
    }
}

// Create snow animation particles
function createSnowParticles(count = 40) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'snow-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = particle.style.height = (Math.random() * 8 + 4) + 'px';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        elements.weatherParticles.appendChild(particle);
    }
}

// Create cloud particles
function createCloudParticles(count = 6) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'cloud-particle';
        particle.style.top = (Math.random() * 40 + 5) + '%';
        particle.style.width = (Math.random() * 100 + 80) + 'px';
        particle.style.height = (Math.random() * 40 + 30) + 'px';
        particle.style.animationDuration = (Math.random() * 40 + 60) + 's';
        particle.style.animationDelay = (Math.random() * -20) + 's';
        elements.weatherParticles.appendChild(particle);
    }
}

// Create wind particles
function createWindParticles(count = 20) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'wind-particle';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.width = (Math.random() * 100 + 50) + 'px';
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        particle.style.animationDelay = (Math.random() * 3) + 's';
        elements.weatherParticles.appendChild(particle);
    }
}

// Create lightning flash effect
function createLightningFlash() {
    const lightning = document.createElement('div');
    lightning.className = 'lightning-flash';
    elements.weatherParticles.appendChild(lightning);
    
    // Random lightning strikes
    setInterval(() => {
        if (Math.random() > 0.7) {
            lightning.classList.add('active');
            setTimeout(() => {
                lightning.classList.remove('active');
            }, 300);
        }
    }, 5000);
}

// Create fog particles
function createFogParticles(count = 15) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'fog-particle';
        particle.style.top = (Math.random() * 100) + '%';
        particle.style.width = (Math.random() * 300 + 200) + 'px';
        particle.style.height = (Math.random() * 100 + 80) + 'px';
        particle.style.animationDuration = (Math.random() * 20 + 30) + 's';
        particle.style.animationDelay = (Math.random() * -10) + 's';
        elements.weatherParticles.appendChild(particle);
    }
}

// Create sun rays
function createSunRays() {
    const sunRays = document.createElement('div');
    sunRays.className = 'sun-rays';
    elements.weatherParticles.appendChild(sunRays);
}

// Create stars for night sky
function createStars(count = 50) {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.top = (Math.random() * 70) + '%';
        star.style.left = (Math.random() * 100) + '%';
        star.style.width = star.style.height = (Math.random() * 3 + 1) + 'px';
        star.style.animationDelay = (Math.random() * 3) + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starsContainer.appendChild(star);
    }
    
    elements.weatherParticles.appendChild(starsContainer);
}

// Create moon for night sky
function createMoon() {
    const moon = document.createElement('div');
    moon.className = 'moon';
    elements.weatherParticles.appendChild(moon);
}

// Update and display current time for the searched location
function updateLocationCurrentTime(weatherData) {
    const updateTime = () => {
        // Get the current time from weather data (already in location's timezone)
        const dataFetchTime = new Date(weatherData.current.time);
        
        // Calculate elapsed time since data was fetched
        const now = new Date();
        const elapsedMs = now - dataFetchTime;
        
        // Add elapsed time to get current location time
        const currentLocationTime = new Date(dataFetchTime.getTime() + elapsedMs);
        
        // Format the date and time manually
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const weekday = weekdays[currentLocationTime.getDay()];
        const month = months[currentLocationTime.getMonth()];
        const day = currentLocationTime.getDate();
        const year = currentLocationTime.getFullYear();
        
        let hours = currentLocationTime.getHours();
        const minutes = String(currentLocationTime.getMinutes()).padStart(2, '0');
        const seconds = String(currentLocationTime.getSeconds()).padStart(2, '0');
        
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        
        elements.currentTime.textContent = `${weekday}, ${month} ${day}, ${year} at ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    };
    
    // Update immediately
    updateTime();
    
    // Update every second
    if (window.locationTimeInterval) {
        clearInterval(window.locationTimeInterval);
    }
    window.locationTimeInterval = setInterval(updateTime, 1000);
}

// Search functionality
function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    if (query.length < 3) {
        hideSuggestions();
        return;
    }
    
    // Debounce search suggestions
    searchTimeout = setTimeout(() => {
        fetchCitySuggestions(query);
    }, 300);
}

function handleSearchKeyPress(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
}

async function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    if (!query) {
        return;
    }
    
    hideSuggestions();
    await getWeatherByCity(query);
    elements.searchInput.blur();
}

// Fetch city suggestions for search
async function fetchCitySuggestions(query) {
    try {
        const url = `${API_CONFIG.GEO_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch city suggestions');
        }
        
        const data = await response.json();
        const cities = data.results || [];
        displaySuggestions(cities);
        
    } catch (error) {
        console.error('Failed to fetch city suggestions:', error);
        hideSuggestions();
    }
}

// Display search suggestions
function displaySuggestions(cities) {
    if (cities.length === 0) {
        hideSuggestions();
        return;
    }
    
    elements.searchSuggestions.innerHTML = '';
    
    cities.forEach(city => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'suggestion-item';
        
        const displayName = `${city.name}${city.admin1 ? ', ' + city.admin1 : ''}${city.country ? ', ' + city.country : ''}`;
        suggestionItem.textContent = displayName;
        
        suggestionItem.addEventListener('click', () => {
            elements.searchInput.value = city.name;
            getWeatherByCoordinates(city.latitude, city.longitude);
            hideSuggestions();
        });
        
        elements.searchSuggestions.appendChild(suggestionItem);
    });
    
    elements.searchSuggestions.style.display = 'block';
}

// Hide search suggestions
function hideSuggestions() {
    elements.searchSuggestions.style.display = 'none';
}

// Toggle temperature units
function toggleUnits() {
    currentUnits = currentUnits === 'metric' ? 'imperial' : 'metric';
    elements.unitsToggle.querySelector('.unit-text').textContent = currentUnits === 'metric' ? '°C' : '°F';
    
    // Refresh weather data with new units
    if (currentLocationData) {
        const { coord } = currentLocationData;
        getWeatherByCoordinates(coord.lat, coord.lon);
    }
}

// Utility function to format time from timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Utility function to format hour time
function formatHourTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// Show/hide loading screen
function showLoading() {
    elements.loadingScreen.classList.remove('hidden');
    elements.weatherApp.classList.remove('loaded');
}

function hideLoading() {
    elements.loadingScreen.classList.add('hidden');
    elements.weatherApp.classList.add('loaded');
}

// Error handling
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorModal.style.display = 'block';
    hideLoading();
}

function closeErrorModal() {
    elements.errorModal.style.display = 'none';
}

async function retryWeatherUpdate() {
    closeErrorModal();
    await getUserLocation();
}

// Handle online/offline status
function handleOnlineStatus() {
    console.log('App is online');
    // You could show a notification here
}

function handleOfflineStatus() {
    console.log('App is offline');
    showError('You appear to be offline. Weather data may not be current.');
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        elements.searchInput.focus();
    }
    
    // Escape to close modals or clear search
    if (e.key === 'Escape') {
        if (elements.errorModal.style.display === 'block') {
            closeErrorModal();
        } else if (document.activeElement === elements.searchInput) {
            elements.searchInput.blur();
            hideSuggestions();
        }
    }
    
    // Ctrl/Cmd + L to get current location
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        getUserLocation();
    }
    
    // Ctrl/Cmd + U to toggle units
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        toggleUnits();
    }
}

// Export functions for potential future use or testing
window.WeatherApp = {
    getWeatherByCity,
    getWeatherByCoordinates,
    toggleUnits,
    getUserLocation,
    updateCurrentTime
};

// Service Worker registration for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // You can add a service worker here for offline functionality
        console.log('Service Worker support detected');
    });
}

// Console welcome message
console.log(`
🌤️ WeatherWise - Your Personal Weather Companion
===============================================

Keyboard Shortcuts:
• Ctrl/Cmd + K: Focus search
• Ctrl/Cmd + L: Get current location  
• Ctrl/Cmd + U: Toggle °C/°F
• Escape: Close modals/clear search

API: Open-Meteo (Free, No Registration Required)
Built with ❤️ using HTML, CSS, and JavaScript

Learn more about Open-Meteo: https://open-meteo.com/
`);

// Analytics or tracking initialization could go here
// Example: Google Analytics, Mixpanel, etc.

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
                console.log(`Page load time: ${entry.loadEventEnd - entry.loadEventStart}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['navigation'] });
}

// Weather API Module
// Handles Open-Meteo Geocoding and Forecast API calls

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

// WMO Weather Code Mapping
const weatherCodeMap = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Fog', icon: 'cloud-fog' },
    48: { description: 'Depositing rime fog', icon: 'cloud-fog' },
    51: { description: 'Light drizzle', icon: 'cloud-drizzle' },
    53: { description: 'Moderate drizzle', icon: 'cloud-drizzle' },
    55: { description: 'Dense drizzle', icon: 'cloud-drizzle' },
    56: { description: 'Light freezing drizzle', icon: 'cloud-drizzle' },
    57: { description: 'Dense freezing drizzle', icon: 'cloud-drizzle' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-rain' },
    65: { description: 'Heavy rain', icon: 'cloud-rain' },
    66: { description: 'Light freezing rain', icon: 'cloud-rain' },
    67: { description: 'Heavy freezing rain', icon: 'cloud-rain' },
    71: { description: 'Slight snow fall', icon: 'cloud-snow' },
    73: { description: 'Moderate snow fall', icon: 'cloud-snow' },
    75: { description: 'Heavy snow fall', icon: 'cloud-snow' },
    77: { description: 'Snow grains', icon: 'cloud-snow' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { description: 'Violent rain showers', icon: 'cloud-rain' },
    85: { description: 'Slight snow showers', icon: 'cloud-snow' },
    86: { description: 'Heavy snow showers', icon: 'cloud-snow' },
    95: { description: 'Thunderstorm', icon: 'cloud-lightning' },
    96: { description: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' }
};

function mapWeatherCode(code) {
    return weatherCodeMap[code] || { description: 'Unknown', icon: 'cloud' };
}

function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function formatTemperature(temp, unit) {
    if (unit === 'fahrenheit') {
        return Math.round(celsiusToFahrenheit(temp));
    }
    return Math.round(temp);
}

function getTemperatureUnitSymbol(unit) {
    return unit === 'fahrenheit' ? '°F' : '°C';
}

// Search for city using Geocoding API
async function searchCity(cityName) {
    try {
        const url = `${GEOCODING_API_BASE}?name=${encodeURIComponent(cityName)}&count=5&language=en&format=json`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }
        
        return data.results;
    } catch (error) {
        throw error;
    }
}

// Get weather forecast using coordinates
async function getWeatherForecast(latitude, longitude) {
    try {
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index',
            hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum',
            timezone: 'auto'
        });
        
        const url = `${WEATHER_API_BASE}?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

// Get weather by city name
async function getWeatherByCity(cityName) {
    const results = await searchCity(cityName);
    const location = results[0]; // Use first result
    const forecast = await getWeatherForecast(location.latitude, location.longitude);
    
    return {
        location: {
            name: location.name,
            country: location.country,
            latitude: location.latitude,
            longitude: location.longitude
        },
        forecast: forecast
    };
}

// Get weather by coordinates (geolocation)
async function getWeatherByCoordinates(latitude, longitude) {
    try {
        const forecast = await getWeatherForecast(latitude, longitude);
        // Try to get location name using reverse geocoding approximation
        // For simplicity, we'll use coordinates or a generic name
        return {
            location: {
                name: 'Current Location',
                country: '',
                latitude: latitude,
                longitude: longitude
            },
            forecast: forecast
        };
    } catch (error) {
        throw error;
    }
}

// Format time from ISO string
function formatTime(isoString, timezone) {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
        });
    } catch {
        return '';
    }
}

// Format date
function formatDate(isoString) {
    try {
        const date = new Date(isoString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { weekday: 'long' });
        }
    } catch {
        return '';
    }
}

// Get current time formatted
function getCurrentTime() {
    return new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchCity,
        getWeatherForecast,
        getWeatherByCity,
        getWeatherByCoordinates,
        mapWeatherCode,
        celsiusToFahrenheit,
        formatTemperature,
        getTemperatureUnitSymbol,
        formatTime,
        formatDate,
        getCurrentTime
    };
}

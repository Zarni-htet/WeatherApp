// UI Module
// Handles DOM manipulation, rendering, and UI state management

let currentUnit = 'celsius'; // 'celsius' or 'fahrenheit'

// Get DOM elements
const elements = {
    searchForm: document.getElementById('search-form'),
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    unitToggle: document.getElementById('unit-toggle'),
    unitText: document.getElementById('unit-text'),
    geolocateBtn: document.getElementById('geolocate-btn'),
    
    loading: document.getElementById('loading'),
    errorMessage: document.getElementById('error-message'),
    errorText: document.getElementById('error-text'),
    emptyState: document.getElementById('empty-state'),
    
    currentSection: document.getElementById('current-section'),
    currentCity: document.getElementById('current-city'),
    currentTime: document.getElementById('current-time'),
    currentIcon: document.getElementById('current-icon'),
    currentTemp: document.getElementById('current-temp'),
    currentCondition: document.getElementById('current-condition'),
    feelsLike: document.getElementById('feels-like'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('wind-speed'),
    uvIndex: document.getElementById('uv-index'),
    
    hourlySection: document.getElementById('hourly-section'),
    hourlyForecast: document.getElementById('hourly-forecast'),
    
    dailySection: document.getElementById('daily-section'),
    dailyForecast: document.getElementById('daily-forecast')
};

// Show loading state
function showLoading() {
    elements.loading.style.display = 'block';
    elements.errorMessage.style.display = 'none';
    elements.emptyState.style.display = 'none';
    elements.currentSection.style.display = 'none';
    elements.hourlySection.style.display = 'none';
    elements.dailySection.style.display = 'none';
}

// Hide loading state
function hideLoading() {
    elements.loading.style.display = 'none';
}

// Show error message
function showError(message) {
    hideLoading();
    elements.errorText.textContent = message;
    elements.errorMessage.style.display = 'block';
    elements.emptyState.style.display = 'none';
    elements.currentSection.style.display = 'none';
    elements.hourlySection.style.display = 'none';
    elements.dailySection.style.display = 'none';
}

// Hide error message
function hideError() {
    elements.errorMessage.style.display = 'none';
}

// Show empty state
function showEmptyState() {
    hideLoading();
    hideError();
    elements.emptyState.style.display = 'block';
    elements.currentSection.style.display = 'none';
    elements.hourlySection.style.display = 'none';
    elements.dailySection.style.display = 'none';
}

// Hide empty state
function hideEmptyState() {
    elements.emptyState.style.display = 'none';
}

// Get current unit
function getCurrentUnit() {
    return currentUnit;
}

// Toggle temperature unit
function toggleUnit() {
    currentUnit = currentUnit === 'celsius' ? 'fahrenheit' : 'celsius';
    elements.unitText.textContent = currentUnit === 'celsius' ? '°C' : '°F';
    return currentUnit;
}

// Render current weather
function renderCurrentWeather(weatherData, location) {
    hideLoading();
    hideError();
    hideEmptyState();
    
    elements.currentSection.style.display = 'block';
    
    // Set location
    elements.currentCity.textContent = location.country 
        ? `${location.name}, ${location.country}` 
        : location.name;
    
    // Set current time
    elements.currentTime.textContent = getCurrentTime ? getCurrentTime() : new Date().toLocaleString();
    
    // Set current weather
    const current = weatherData.current;
    const weatherInfo = mapWeatherCode ? mapWeatherCode(current.weather_code) : { description: 'Unknown', icon: 'cloud' };
    
    elements.currentCondition.textContent = weatherInfo.description;
    
    // Update icon
    if (elements.currentIcon) {
        elements.currentIcon.setAttribute('data-lucide', weatherInfo.icon);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // Set temperature
    const temp = formatTemperature ? formatTemperature(current.temperature_2m, currentUnit) : Math.round(current.temperature_2m);
    elements.currentTemp.textContent = temp;
    
    // Update unit symbol
    const unitSymbol = getTemperatureUnitSymbol ? getTemperatureUnitSymbol(currentUnit) : (currentUnit === 'celsius' ? '°C' : '°F');
    // Update temp unit display
    const tempUnitSpan = document.querySelector('.temp-unit');
    if (tempUnitSpan) {
        tempUnitSpan.textContent = unitSymbol;
    }
    
    // Set details
    const feelsLikeTemp = formatTemperature ? formatTemperature(current.apparent_temperature, currentUnit) : Math.round(current.apparent_temperature);
    elements.feelsLike.textContent = `${feelsLikeTemp} ${unitSymbol}`;
    
    elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    
    elements.windSpeed.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
    
    if (current.uv_index !== undefined && current.uv_index !== null) {
        elements.uvIndex.textContent = Math.round(current.uv_index);
    } else {
        elements.uvIndex.textContent = 'N/A';
    }
}

// Render hourly forecast (next 24 hours)
function renderHourlyForecast(weatherData) {
    elements.hourlySection.style.display = 'block';
    elements.hourlyForecast.innerHTML = '';
    
    const hourly = weatherData.hourly;
    const currentHour = new Date().getHours();
    
    // Show next 24 hours
    for (let i = 0; i < 24 && i < hourly.time.length; i++) {
        const time = new Date(hourly.time[i]);
        const hour = time.getHours();
        const hourStr = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
        
        const weatherInfo = mapWeatherCode ? mapWeatherCode(hourly.weather_code[i]) : { description: 'Unknown', icon: 'cloud' };
        const temp = formatTemperature ? formatTemperature(hourly.temperature_2m[i], currentUnit) : Math.round(hourly.temperature_2m[i]);
        const unitSymbol = getTemperatureUnitSymbol ? getTemperatureUnitSymbol(currentUnit) : (currentUnit === 'celsius' ? '°C' : '°F');
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <span class="hourly-time">${hourStr}</span>
            <i data-lucide="${weatherInfo.icon}" class="hourly-icon"></i>
            <span class="hourly-temp">${temp}${unitSymbol}</span>
        `;
        elements.hourlyForecast.appendChild(hourlyItem);
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render daily forecast (7 days)
function renderDailyForecast(weatherData) {
    elements.dailySection.style.display = 'block';
    elements.dailyForecast.innerHTML = '';
    
    const daily = weatherData.daily;
    
    for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        let dayStr;
        
        if (i === 0) {
            dayStr = 'Today';
        } else if (i === 1) {
            dayStr = 'Tomorrow';
        } else {
            dayStr = date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        const weatherInfo = mapWeatherCode ? mapWeatherCode(daily.weather_code[i]) : { description: 'Unknown', icon: 'cloud' };
        const highTemp = formatTemperature ? formatTemperature(daily.temperature_2m_max[i], currentUnit) : Math.round(daily.temperature_2m_max[i]);
        const lowTemp = formatTemperature ? formatTemperature(daily.temperature_2m_min[i], currentUnit) : Math.round(daily.temperature_2m_min[i]);
        const unitSymbol = getTemperatureUnitSymbol ? getTemperatureUnitSymbol(currentUnit) : (currentUnit === 'celsius' ? '°C' : '°F');
        
        const dailyItem = document.createElement('div');
        dailyItem.className = 'daily-item';
        dailyItem.innerHTML = `
            <span class="daily-day">${dayStr}</span>
            <i data-lucide="${weatherInfo.icon}" class="daily-icon"></i>
            <div class="daily-temps">
                <span class="daily-temp-high">${highTemp}${unitSymbol}</span>
                <span class="daily-temp-low">${lowTemp}${unitSymbol}</span>
            </div>
        `;
        elements.dailyForecast.appendChild(dailyItem);
    }
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Render all weather data
function renderWeather(weatherData, location) {
    renderCurrentWeather(weatherData, location);
    renderHourlyForecast(weatherData);
    renderDailyForecast(weatherData);
}

// Update all displays when unit changes
function updateAllDisplays(weatherData, location) {
    if (weatherData && location) {
        renderCurrentWeather(weatherData, location);
        renderHourlyForecast(weatherData);
        renderDailyForecast(weatherData);
    }
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showLoading,
        hideLoading,
        showError,
        hideError,
        showEmptyState,
        hideEmptyState,
        toggleUnit,
        getCurrentUnit,
        renderWeather,
        updateAllDisplays,
        elements
    };
}

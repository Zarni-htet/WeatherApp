// Main App Module
// Orchestrates weather app functionality

let currentWeatherData = null;
let currentLocation = null;

// Initialize the app
function initApp() {
    // Set up event listeners
    if (elements.searchForm) {
        elements.searchForm.addEventListener('submit', handleSearch);
    }
    
    if (elements.geolocateBtn) {
        elements.geolocateBtn.addEventListener('click', handleGeolocation);
    }
    
    if (elements.unitToggle) {
        elements.unitToggle.addEventListener('click', handleUnitToggle);
    }
    
    // Show empty state initially
    showEmptyState();
}

// Handle search form submission
async function handleSearch(e) {
    e.preventDefault();
    
    const cityName = elements.cityInput.value.trim();
    
    if (!cityName) {
        showError('Please enter a city name');
        return;
    }
    
    try {
        showLoading();
        const result = await getWeatherByCity(cityName);
        currentWeatherData = result.forecast;
        currentLocation = result.location;
        
        renderWeather(currentWeatherData, currentLocation);
    } catch (error) {
        showError(error.message || 'Failed to fetch weather data');
    }
}

// Handle geolocation
async function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    try {
        showLoading();
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const result = await getWeatherByCoordinates(latitude, longitude);
                    currentWeatherData = result.forecast;
                    currentLocation = result.location;
                    
                    renderWeather(currentWeatherData, currentLocation);
                } catch (error) {
                    showError(error.message || 'Failed to fetch weather data for your location');
                }
            },
            (error) => {
                hideLoading();
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        showError('Location access denied. Please enable location permissions or search for a city.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        showError('Location information unavailable.');
                        break;
                    case error.TIMEOUT:
                        showError('Location request timed out.');
                        break;
                    default:
                        showError('An error occurred while getting your location.');
                        break;
                }
            },
            {
                timeout: 10000,
                enableHighAccuracy: true
            }
        );
    } catch (error) {
        showError(error.message || 'Failed to get location');
    }
}

// Handle unit toggle
function handleUnitToggle() {
    const newUnit = toggleUnit();
    if (currentWeatherData && currentLocation) {
        updateAllDisplays(currentWeatherData, currentLocation);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Also ensure init runs after all scripts load
window.addEventListener('load', () => {
    // Re-initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

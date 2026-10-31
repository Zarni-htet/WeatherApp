# Weather App - Detailed Implementation Plan

## 1) Project Analysis
- **Current state**: Empty repo (only `.opencode/` agents + `workflow`). No source files exist.
- **Goal**: Build a modern, responsive weather dashboard using vanilla HTML/CSS/JS with real data from Open-Meteo APIs.
- **Constraints**: Follow multi-agent workflow with strict file ownership; no fake data; vanilla JS only.

## 2) Architecture
- **Type**: Client-side SPA (no backend, no build tools). Runs directly in browser.
- **Data flow**: User search/geolocation → Geocoding API (Open-Meteo) → Forecast API (Open-Meteo) → Map data → Render to DOM.
- **State**: Simple in-memory state in `app.js` (current location, units C/F, last results).
- **APIs**:
  - Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
  - Forecast: `https://api.open-meteo.com/v1/forecast`

## 3) Folder Structure
```
weather-app/
├── index.html        # Agent 2 (initial) - main page
├── css/
│   └── style.css     # Agent 2 (initial), Agent 5 (polish only)
├── js/
│   ├── weather.js    # Agent 3 - API calls, mapping, utilities
│   └── app.js        # Agent 3 - UI logic, events, rendering
└── assets/           # Optional (icons/SVGs) - create only if needed
```

## 4) Agent Responsibilities & Ownership
| Agent | Role | Files Owned | Notes |
|---|---|---|---|
| Agent 1 - Architect | Coordination, plan, integration review | None (planning only) | Enforce ownership, define contracts, review compatibility |
| Agent 2 - Frontend | HTML structure, initial CSS | `index.html`, `css/style.css` (initial) | Create DOM hooks with agreed IDs/classes; semantic HTML; accessible |
| Agent 3 - API Developer | API integration, JS logic | `js/weather.js`, `js/app.js` | Vanilla JS, async/await/fetch, no hardcoded data, error handling |
| Agent 5 - UI/UX Specialist | Polish CSS only | `css/style.css` (final improvements) | No HTML/JS changes; preserve selectors and functionality |
| Agent 4 - QA Tester | Read-only testing/reporting | None | No file edits/shell; report bugs with file/line refs |

## 5) Implementation Sequence
1. **Architect** (done): Publish this plan and shared contracts.
2. **Frontend (Agent 2)**: Build `index.html` with all required sections and DOM IDs. Create initial `css/style.css` with glassmorphism, gradients, responsive layout (mobile-first). Establish loading/empty/error state markup.
3. **API (Agent 3)**: Implement `js/weather.js` (geocoding, forecast, WMO mapping, C/F conversion). Implement `js/app.js` (search, geolocation, rendering, unit toggle, wire to DOM). Test against HTML structure.
4. **UI/UX (Agent 5)**: Polish `css/style.css` only - enhance visuals, animations/transitions, spacing/typography, responsiveness, accessibility. Must not break existing selectors.
5. **QA (Agent 4)**: Read-only inspection - test search, geolocation, current/hourly/7-day, units, states, responsiveness. Produce test report.
6. **Architect Review**: Verify ownership compliance, integration, checklist complete.

## 6) Shared Contracts

### Required DOM IDs/Classes
| Element | ID/Class | Purpose |
|---|---|---|
| Search form | `#search-form` | Form submission for city search |
| City input | `#city-input` | Text input for city name |
| Search button | `#search-btn` | Submit button (optional if form used) |
| Unit toggle | `#unit-toggle` | Switch between °C/°F |
| Current section | `#current-section` | Container for current weather |
| Current temp | `#current-temp` | Temperature display |
| Current city/country | `#current-city` | Location display |
| Current condition | `#current-condition` | Weather description |
| Current icon | `#current-icon` | Weather icon/emoji |
| Feels like | `#feels-like` | Apparent temperature |
| Humidity | `#humidity` | Humidity % |
| Wind speed | `#wind-speed` | Wind speed |
| UV index | `#uv-index` | UV index |
| Hourly section | `#hourly-section` | Hourly forecast container |
| Hourly forecast list | `#hourly-forecast` | Items for next 24h |
| Daily section | `#daily-section` | 7-day forecast container |
| Daily forecast list | `#daily-forecast` | Items for 7 days |
| Loading state | `#loading` | Shown during fetch |
| Error message | `#error-message` | Error display |
| Empty state | `#empty-state` | Initial/empty state |

### JS Module Interface (suggested)
**`js/weather.js`** (utilities/API):
- `async searchCity(name)` → returns geocoding results or throws
- `async getForecast(lat, lon)` → returns forecast JSON
- `mapWeatherCode(code)` → `{ description, icon }`
- `toF(c)`, `toC(f)` or unit conversion helpers
- `formatTime(isoString, timezone)` (optional)

**`js/app.js`** (orchestration):
- State: `let units = 'c' | 'f'`, `let currentData = null`
- Event listeners for form, toggle, geolocation
- `renderCurrent(data)`, `renderHourly(data)`, `renderDaily(data)`
- `showLoading/hideLoading`, `showError(msg)`, `hideError()`
- `init()` on DOMContentLoaded

## 7) Feature Requirements Checklist
- [ ] Search bar for city search
- [ ] Current weather: temp, city/country, condition, icon, feels-like, humidity, wind, UV
- [ ] Hourly forecast (next 24 hours)
- [ ] 7-day forecast
- [ ] Celsius/Fahrenheit toggle
- [ ] Browser geolocation (with permission handling)
- [ ] Loading state
- [ ] Empty state
- [ ] Error state (invalid city, network errors)
- [ ] Responsive (desktop/tablet/mobile)
- [ ] Glassmorphism design with gradients
- [ ] Accessible (semantic HTML, labels)
- [ ] No fake/hardcoded weather data

## 8) Integration Checklist
- [ ] HTML structure matches agreed IDs
- [ ] CSS is mobile-first and responsive
- [ ] JS loads after DOM ready; uses fetch/async-await
- [ ] All API calls go through weather.js
- [ ] UI updates reflect real API data
- [ ] Ownership rules respected (no cross-ownership edits)
- [ ] No console errors in normal flows
- [ ] Error/empty/loading states work correctly

## 9) Implementation Notes
- **WMO codes**: Implement mapping for common codes (0 clear, 1-3 cloudy, 45/48 fog, 51-67 drizzle/rain, 71-77 snow, 80-82 showers, 95 thunderstorm).
- **Icons**: Use emoji or inline SVGs (no external icon libraries required).
- **Time**: Use `timezone=auto` from API; format hour/day labels for display.
- **Forecast scope**: Hourly next 24h, daily next 7 days.
- **Units**: Default Celsius; toggle converts displayed values.
- **Geolocation**: Use `navigator.geolocation.getCurrentPosition` with error handling.
- **Robustness**: Handle empty geocoding results, network failures, invalid responses.
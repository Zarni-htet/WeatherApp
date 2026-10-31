# Architect Report - Professional Weather Application

## 1) Requirements Analysis
- Tech: HTML5, CSS3, Vanilla JS, Open-Meteo APIs, Lucide Icons, VS Code, OpenCode
- No React/Next.js
- Features: search, current weather, city/country, condition, icons, feels-like, humidity, wind, UV, hourly (24h), 7-day, C/F toggle, geolocation, loading, errors, responsive
- Design: glassmorphism, blue/purple gradients, modern typography, rounded cards, animations
- Real API data only, no fake data
- 5 agents in sequence, strict ownership

## 2) Project Architecture
- **Pattern**: Client-side SPA, no build step, direct browser calls to Open-Meteo
- **Modules**:
  - `js/weather.js` - API layer (geocoding, forecast, mapping, utils)
  - `js/ui.js` - UI helpers (rendering, DOM updates, icons, states)
  - `js/app.js` - Orchestration (events, state, init)
- **Styling**: CSS with custom properties, glassmorphism, responsive grid/flex
- **Icons**: Lucide Icons (loaded via CDN or local; use script tag)

## 3) Folder Structure (exact)
```
weather-app/
├── .opencode/
│   └── agents/
│       ├── project-architect.md
│       ├── frontend-developer.md
│       ├── weather-api-developer.md (note: workflow says weather-api-developer)
│       ├── ui-ux-specialist.md
│       └── qa-tester.md
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── weather.js
│   └── ui.js
├── index.html
├── README.md
├── package.json
```

Note: Agent file is named `api-developer.md` in repo; user refers to `weather-api-developer` - will call by the configured name as needed.

## 4) Agent Responsibilities & Ownership
| Agent | Ownership | Responsibilities |
|---|---|---|
| project-architect | Planning/integration only | Architecture, contracts, sequence, review |
| frontend-developer | `index.html`, initial `css/style.css` | Structure, markup, initial styles, DOM hooks, accessibility basics |
| weather-api-developer | `js/weather.js`, `js/app.js` | API calls, geocoding, forecast, mapping, geolocation, units, errors |
| ui-ux-specialist | `css/style.css` only (polish) | Glassmorphism, gradients, animations, responsiveness, a11y, performance |
| qa-tester | Read-only | Inspect all files, test features, report bugs with file/line refs (no edits/shell) |

## 5) Implementation Sequence (Sequential)
1. **PHASE 1 - Architect**: Done (this report). Define contracts.
2. **PHASE 2 - Frontend**: Create `index.html` with all sections/IDs, initial `css/style.css`. Use Lucide Icons. Establish states.
3. **PHASE 3 - API/JS**: Implement `js/weather.js`, `js/app.js`, `js/ui.js`. Wire to DOM, integrate Open-Meteo, geolocation, C/F.
4. **PHASE 4 - UI/UX**: Polish `css/style.css` only - enhance visuals, responsive, a11y.
5. **PHASE 5 - QA**: Read-only testing, comprehensive report.
6. **PHASE 6 - Integration Review**: Verify, fix integration issues if any (respecting ownership), final check.

## 6) API Contracts
**Geocoding**: `GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=5&language=en&format=json`
**Forecast**: `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum&timezone=auto`

**WMO Mapping**: 0/1 clear/mainly clear, 2 part cloudy, 3 overcast, 45/48 fog, 51-57 drizzle, 61-67 rain, 71-77 snow, 80-82 showers, 85-86 snow showers, 95 thunderstorm, 96/99 hail.

## 7) Shared DOM Contracts (Required)
| ID | Purpose |
|---|---|
| `#search-form`, `#city-input`, `#search-btn` | Search |
| `#unit-toggle` | C/F toggle |
| `#geolocate-btn` | Geolocation |
| `#loading` | Loading state |
| `#error-message` | Error display |
| `#empty-state` | Initial state |
| `#current-section`, `#current-temp`, `#current-city`, `#current-condition`, `#current-icon` | Current |
| `#feels-like`, `#humidity`, `#wind-speed`, `#uv-index` | Current details |
| `#hourly-section`, `#hourly-forecast` | Hourly (24h) |
| `#daily-section`, `#daily-forecast` | 7-day |

## 8) Integration Checklist
- [ ] All files in correct structure
- [ ] HTML has all sections/IDs, Lucide loaded
- [ ] CSS responsive with glassmorphism/gradients
- [ ] weather.js: geocoding + forecast + mapping + utils
- [ ] ui.js: rendering + states + icons
- [ ] app.js: events + geolocation + orchestration
- [ ] Real API data only
- [ ] C/F toggle works
- [ ] Hourly 24h, daily 7-day
- [ ] Loading/error/empty states
- [ ] No console errors
- [ ] Ownership respected
- [ ] QA report complete

## 9) Notes
- Use Lucide Icons via CDN: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>` and `lucide.createIcons()`
- Default units Celsius; toggle converts
- Handle geolocation permission denied
- Handle empty geocoding results
- Format times appropriately
- Mobile-first responsive design

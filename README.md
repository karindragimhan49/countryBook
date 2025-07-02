# Country Book Application

This application provides comprehensive information about countries around the world, allowing users to search, filter, and save their favorite countries.

This application provides comprehensive information about countries around the world, allowing users to search, filter, and save their favorite countries.

![Country Book App](https://raw.githubusercontent.com/karindragimhan49/countryBook/7fa964863cb679010b77aa458273aceaed19b66b/src/White%20and%20Violet%20Professional%20Modern%20Technology%20Pitch%20Deck%20Presentation%20(3).png)

## Deployment

[Country Details Frontend](https://country-book-ten.vercel.app/)

## Features

- **User Authentication**
  - Register new accounts
  - Login with existing credentials
  - User data persisted in localStorage

- **Country Exploration**
  - Browse all countries with basic information
  - Search countries by name
  - Filter by region and language
  - View detailed country profiles

- **Detailed Country View**
  - Flag and official information
  - Population, area, and languages
  - Interactive map showing country location
  - Real-time clock showing local time vs. country time

- **User Preferences**
  - Save countries to favorites
  - Quick access to favorite countries
  - Toggle between all countries and favorites view

## Tech Stack

- **Frontend**
  - React 19 - Core UI framework
  - React Router 7 - Navigation management
  - Tailwind CSS 4 - Styling
  - Framer Motion - Animations and transitions
  - Leaflet - Interactive maps
  - React Clock - Time display component

- **Development Tools**
  - Vite - Build tool and development server
  - Jest & React Testing Library - Testing framework
  - ESLint - Code quality

- **Data Storage**
  - Browser's localStorage (for demonstration purposes)

## Setup & Installation

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd af-2-Pawarasasmina
   ```

2. **Install dependencies**
   ```
   cd frontend-app
   npm install
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Building for Production

To create a production build:
```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

```
npm test
```

## Project Structure

- `frontend-app/`
  - `src/`
    - `components/` - Reusable UI components
      - `CountryCard.jsx` - Display card for each country
      - `Dashboard.jsx` - Main user dashboard
      - `FilterBar.jsx` - Filtering options component
      - `Header.jsx` - Application header with navigation
      - `SearchBar.jsx` - Search functionality component
      - `__tests__/` - Component tests
    - `contexts/` - React context providers
      - `UserContext.jsx` - Authentication context 
    - `pages/` - Main application pages
      - `Home.jsx` - Main page with country listings
      - `CountryDetail.jsx` - Detailed view of a single country
      - `Login.jsx` - Authentication page
      - `__tests__/` - Page tests
    - `services/` - API services
      - `api.js` - Functions for interacting with REST Countries API
    - `__mocks__/` - Mock files for testing

## API Integration

The application uses the [REST Countries API](https://restcountries.com/v3.1) to fetch country data with the following endpoints:

- `getAllCountries()` - Fetches all countries
- `getCountryByName(name)` - Searches countries by name
- `getCountriesByRegion(region)` - Filters countries by region
- `getCountryByCode(code)` - Gets a specific country by its code

## Technical Report

### Choice of API

The REST Countries API (https://restcountries.com/v3.1) was selected for this project based on several considerations:

1. **Rich Data Set**: The API provides comprehensive information about countries including flags, population, languages, currencies, and timezones.

2. **No Authentication Required**: The API is freely accessible without API keys, simplifying development and deployment.

3. **Well-Documented**: Clear documentation and predictable response structure made integration straightforward.

4. **Reliability**: The API has proven to be stable with good uptime and reasonable response times.

### Challenges and Solutions

#### Challenge 1: Client-Side Authentication

**Challenge**: Implementing user authentication without a backend server.

**Solution**: Used browser's localStorage to manage user sessions and credentials. While not secure enough for a production environment, this approach allowed demonstration of the authentication flow in a frontend-only application.

#### Challenge 2: Time Zone Handling

**Challenge**: Displaying accurate local time for each country based on their time zones.

**Solution**: Leveraged JavaScript's Intl.DateTimeFormat API to handle timezone conversions, allowing display of both user's local time and the country's local time simultaneously.

#### Challenge 3: Efficient Filtering and Searching

**Challenge**: Implementing performant search and filter functionality across a large dataset.

**Solution**: Implemented client-side filtering using React's state management. Applied filters sequentially and cached the full country list to minimize API calls and improve performance.

#### Challenge 4: Interactive Maps Integration

**Challenge**: Integrating interactive maps to display country locations.

**Solution**: Used React-Leaflet to embed maps with country markers. Configured the map to automatically center on the selected country and display relevant information in popups.

#### Challenge 5: Testing Components with External Dependencies

**Challenge**: Creating reliable tests for components that depend on API data and browser features.

**Solution**: Implemented comprehensive mocks for the API service and browser APIs like localStorage. Used Jest's mocking capabilities to isolate components during testing.

## Future Improvements

1. Implement a proper backend with secure authentication
2. Add more filtering options (population range, area, etc.)
3. Implement country comparison feature
4. Add more detailed statistics with visual charts
5. Support for offline mode using service workers
6. Add multilingual support for the interface

## License

This project was created as part of an academic assignment at SLIIT.

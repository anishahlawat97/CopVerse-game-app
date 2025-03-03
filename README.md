# CopVerse - Vehicle Selection Game

## Overview

CopVerse is an interactive web-based game where players act as cops, selecting cities and appropriate vehicles for a pursuit. The game enforces realistic constraints on vehicle selection, ensuring only suitable vehicles can be chosen based on availability and range.

## Features

- **City Selection:** Users choose cities where the chase takes place.
- **Vehicle Selection:** Players select vehicles for each cop based on distance and availability.
- **Game Logic Enforcement:** Prevents invalid selections such as unavailable or insufficient-range vehicles.
- **Interactive UI:** Smooth user experience with animations and real-time selection updates.
- **Test Suite:** Automated unit and integration tests for UI using Jest and E2E test with Playwright.

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **State Management:** React hooks
- **Backend API:** Next.js API Routes
- **Database:** Prisma with MongoDB (for future enhancements)
- **Testing:** Jest, React Testing Library, Playwright

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/copverse.git
   cd copverse
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Testing

Run the test suite using:

```bash
npm run test # For Jest tests
npx playwright test # For Playwright e2e tests
```

## Assumptions

- **Vehicle Selection Constraints**: Vehicles are selectable only if they are available and have sufficient range for a round trip. These constraints are enforced in the UI and backend.
- **Session Management**: Selected cities and vehicles are stored in session storage. This assumes a simple game state that resets after navigation.
- **Submission Process**: The API expects a payload containing the game session ID and selected vehicles for cops, and it returns success/failure responses.
- **Game Flow**: The game follows a structured flow: selecting cities → choosing vehicles → submitting selections → viewing results.

## Future Enhancements

- **User Authentication:** Persist user game progress and selections.
- **Leaderboard System:** Track and display top-performing players.
- **Enhanced Game Mechanics:** Introduce new challenges and constraints.

## Author

Developed by Anish Ahlawat. Feel free to contribute and improve the project!


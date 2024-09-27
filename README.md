# Waldo API

This is the **Waldo API**, a RESTful API backend for a "Where's Waldo" type game where players search for characters on maps. The API supports map data, character information, game sessions and leaderboards for maps.

To view the front-end React app that uses the API, [click here!](https://github.com/gustydev/find-them-all/)

## Features

- **Game Management**: Create, start, and track game sessions.
- **Map & Character Data**: Retrieve maps and their associated characters.
- **Leaderboards**: Track and fetch player scores based on completion times.
- **Guessing System**: Players can make guesses by providing coordinates and identifying characters.
- **Game Expiry**: Games expire automatically after 3 hours if not completed, using a TTL index
- **Authorization**: Uses an environment variable (SECRET_PASS) to prevent cheating in scores

## Technologies Used

- **Node.js**
- **Express**
- **MongoDB with Mongoose ORM**
- **Express-Validator for request validation**

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance (local or cloud-based)
- `npm` package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gustydev/waldo-api.git
   cd waldo-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:

   ```
   PORT=3000
   MONGO_URI=your_mongo_db_connection_string
   BASE_URL=http://localhost:3000
   SECRET_PASS=secret_password # Must match the password in the front-end app
   ```

4. Start the server:
   ```bash
   npm run start
   ```

### Endpoints

| Method | Endpoint                         | Description                                      |
|--------|----------------------------------|--------------------------------------------------|
| POST   | `/api/game/new/:mapId`           | Start a new game for a selected map              |
| POST   | `/api/game/:gameId/guess`        | Make a guess by submitting character id and coordinates |
| POST   | `/api/map/:mapId/score`           | Submit player's score to leaderboard with their name, time and date (secret password required) |
| GET    | `/api/map/list`                  | Fetch all available maps                         |
| GET    | `/api/map/:mapId?leaderboard=true` | Get map details and (optionally) leaderboard                |
| GET    | `/api/game/:gameId`              | Fetch details of a game session          |
| PUT    | `/api/game/:gameId/start`             | Set game as started                              |
| DELETE | `/api/game/:gameId`                   | Delete game session                              |

### Example Requests

- **Starting a Game**:
   ```bash
   POST /api/game/new/:mapId
   ```

- **Making a Guess**:
   ```bash
   POST /api/game/:gameId/guess
   Headers: Content-Type: application/json
   Body:
   {
     "coordinates": { "x": 125, "y": 340 },
     "option": "characterId"
   }
   ```
- **Submitting a score**:
  ```bash
  POST /api/map/:mapId/score
  Headers: Content-Type-: application/json
  Body:
  {
    "name": "PlayerName",
    "time": "1337",
    "password": "secret_password"
  }
  ```

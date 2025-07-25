# Quote App

A full-stack application with React frontend and FastAPI backend.

## Project Structure

```
quote-app/
├── backend/          # FastAPI backend
├── frontend/         # React frontend
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Development Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)
- Python 3.11+ (for local development)

### Running with Docker

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Run frontend linting:**
   ```bash
   docker-compose run --rm frontend npm run lint
   ```

3. **Run frontend tests:**
   ```bash
   docker-compose run --rm frontend npm test -- --watchAll=false
   ```

4. **Check frontend formatting:**
   ```bash
   docker-compose run --rm frontend npx prettier --check "src/**/*.{js,jsx}" "*.{js,jsx,json}"
   ```

5. **Run backend linting:**
   ```bash
   docker-compose run --rm backend flake8 .
   ```

6. **Run backend tests:**
   ```bash
   docker-compose run --rm backend pytest
   ```

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## CI/CD

The project includes GitHub Actions CI pipeline that:
- Builds Docker images
- Runs linting (ESLint, Flake8)
- Checks code formatting (Prettier, Black)
- Runs tests (Jest, Pytest)

## Recent Fixes

- **Fixed npm not found error**: Updated frontend Dockerfile to use Node.js instead of nginx for development/CI
- **Updated CI syntax**: Changed from `docker compose` to `docker-compose` for compatibility
- **Created Dockerfile.dev**: Separate Dockerfile for development that includes Node.js tools

## Services

- **Frontend**: React app running on port 3000
- **Backend**: FastAPI app running on port 8000
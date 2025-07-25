# Makefile

# Start all services in detached mode
up:
	docker-compose up --build -d

# Stop all services
down:
	docker-compose down

# Show logs for all services
logs:
	docker-compose logs -f

# Force rebuild all images
build:
	docker-compose build --no-cache
# Quote App - Full-Stack Docker Demo

A simple full-stack application built with React.js, FastAPI, and Docker. This project demonstrates how to containerize and connect a frontend and backend service using Docker Compose.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

## Getting Started

### Prerequisites

* Docker & Docker Compose

### Installation

1.  Clone the repository:
    ```sh
    git clone [https://github.com/your-username/quote-app.git](https://github.com/your-username/quote-app.git)
    cd quote-app
    ```

2.  Build and run the containers in detached mode:
    ```sh
    docker-compose up --build -d
    ```

3.  The application will be available at:
    * Frontend (React): `http://localhost:3000`
    * Backend API Docs: `http://localhost:8000/docs`
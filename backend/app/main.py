from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.routers import quotes
from app.dependencies import limiter


def create_app():
    """
    Create a FastAPI app with the following features:
    - Rate limiting
    - CORS
    - API routes
    """
    app = FastAPI()

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    origins = [
        "http://localhost:3000",
        "http://localhost",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(quotes.router, prefix="/api/v1")

    return app


app = create_app()

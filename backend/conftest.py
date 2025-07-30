import pytest
from fastapi.testclient import TestClient
from app.main import create_app
from app.dependencies import limiter


@pytest.fixture(scope="function")
def client():
    """
    Create a test client for each function in the test suite.
    """
    app = create_app()
    yield TestClient(app)

    limiter.reset()

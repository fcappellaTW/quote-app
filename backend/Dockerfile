FROM python:3.11-slim as development

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY backend/requirements.txt backend/requirements-dev.txt pyproject.toml ./

RUN pip install --no-cache-di -r requirements-dev.txt

COPY . .

FROM python:3.11-slim as production

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app /app/backend

ENV PYTHONPATH "${PYTHONPATH}:/app/backend"

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
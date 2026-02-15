import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestHealthEndpoints:
    def test_health_returns_200(self):
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "chroma" in data

    def test_models_returns_200(self):
        response = client.get("/api/v1/health/models")
        assert response.status_code == 200
        data = response.json()
        assert "embedding_model" in data
        assert "generation_model" in data


class TestDocumentEndpoints:
    def test_supported_types(self):
        response = client.get("/api/v1/documents/supported-types")
        assert response.status_code == 200
        data = response.json()
        assert "extensions" in data
        assert ".pdf" in data["extensions"]
        assert ".py" in data["extensions"]


class TestCollectionEndpoints:
    def test_list_collections(self):
        response = client.get("/api/v1/collections")
        assert response.status_code == 200
        data = response.json()
        assert "collections" in data

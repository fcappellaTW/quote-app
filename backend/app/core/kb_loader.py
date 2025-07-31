import json
from pathlib import Path


def _load_json_from_kb(filename: str) -> list[dict]:
    """
    Loads and parses a JSON file from the knowledge_base directory.
    """
    root_dir = Path(__file__).parent.parent.parent
    json_path = root_dir / "knowledge_base" / filename

    try:
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return []


FALLBACK_QUOTES = _load_json_from_kb("quotes.json")

import json
import re
import uuid
from copy import deepcopy
from pathlib import Path

from flask import Flask, Response, jsonify, render_template, request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parents[1]
PACKAGE_DIST = ROOT_DIR / "packages" / "parallax-scene-studio" / "dist"
LIGHTHOUSE_DIR = BASE_DIR / "static" / "lighthouse"
UPLOAD_DIR = BASE_DIR / "static" / "uploads"

ALLOWED_MIME_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}
MAX_UPLOAD_BYTES = 5 * 1024 * 1024

app = Flask(__name__)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/vendor/<path:filename>")
def vendor(filename: str):
    if filename == "parallax-scene-studio.js":
        return send_from_directory(PACKAGE_DIST, "parallax-scene-studio.umd.cjs", mimetype="text/javascript")
    if filename == "style.css":
        return send_from_directory(PACKAGE_DIST, "style.css", mimetype="text/css")
    return Response("Not found", status=404)


@app.get("/api/scene/lighthouse")
def lighthouse_scene():
    config_path = LIGHTHOUSE_DIR / "config.json"
    with config_path.open("r", encoding="utf-8") as handle:
        scene = json.load(handle)

    scene = normalize_lighthouse_scene(scene)
    return jsonify(scene)


@app.get("/assets/lighthouse/<path:filename>")
def lighthouse_asset(filename: str):
    return send_from_directory(LIGHTHOUSE_DIR, filename)


@app.get("/uploads/<path:filename>")
def uploaded_asset(filename: str):
    return send_from_directory(UPLOAD_DIR, filename)


@app.post("/api/uploads/local")
def upload_local():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    content_type = file.mimetype or "application/octet-stream"
    ext = ALLOWED_MIME_TYPES.get(content_type)
    if not ext:
        return jsonify({"error": "Only PNG, JPEG, WebP, and SVG images are allowed"}), 400

    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    if size > MAX_UPLOAD_BYTES:
        return jsonify({"error": "File must be under 5 MB"}), 413

    safe_name = sanitize_filename(file.filename or "image")
    if not safe_name.lower().endswith(tuple(ALLOWED_MIME_TYPES.values())):
        safe_name = f"{safe_name}{ext}"

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}_{safe_name}"
    file.save(UPLOAD_DIR / filename)

    return jsonify({
        "result": "success",
        "url": f"/uploads/{filename}",
        "filename": filename,
    })


def normalize_lighthouse_scene(source: dict) -> dict:
    scene = deepcopy(source)
    scene["schema_version"] = 1
    scene.setdefault("accent", "#ffb020")
    scene.setdefault("design_ratio", 1.778)
    scene.setdefault("layer_offset", {"left": 0, "top": 0})
    scene.setdefault("blur", {
        "dark": "rgba(10, 15, 28, 0.95)",
        "light": "rgba(230, 235, 245, 0.95)",
    })

    def rewrite_element(element: dict):
        image = element.get("image")
        if image and not image.startswith(("http://", "https://", "/", "data:", "blob:")):
            element["image"] = f"/assets/lighthouse/{image}"
        if element.get("y") == "auto":
            element["y"] = "auto"
        for child in element.get("children", []) or []:
            rewrite_element(child)

    for layer in scene.get("layers", []) or []:
        for element in layer.get("elements", []) or []:
            rewrite_element(element)

    return scene


def sanitize_filename(filename: str) -> str:
    base = filename.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
    base = re.sub(r"[^a-zA-Z0-9._-]+", "_", base).strip("._")
    return base or "image"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8788, debug=False, use_reloader=False)

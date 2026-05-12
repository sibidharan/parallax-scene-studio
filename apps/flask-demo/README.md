# Flask Lighthouse Demo

Small Flask demo for Parallax Scene Studio using the Lighthouse theme assets.

This app is intentionally simple:

- serves the built library from `packages/parallax-scene-studio/dist`
- serves the Lighthouse assets from `static/lighthouse`
- exposes `/api/scene/lighthouse` with image URLs rewritten for this Flask app
- exposes `/api/uploads/local` for local demo uploads

## Run

Build the browser package first:

```bash
npm run build
```

Then run Flask:

```bash
cd apps/flask-demo
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
flask --app app run --host 0.0.0.0 --port 8788
```

If your system Python does not have `venv`, install dependencies into a local target folder:

```bash
python3 -m pip install --target .python-packages -r requirements.txt
PYTHONPATH=.python-packages python3 app.py
```

Open:

```text
http://localhost:8788
```

## Asset Note

The checked-in Lighthouse assets are demo seed assets. Replace them with your own public assets before hosting if these are not meant to be distributed with your project.

# Parallax Scene Studio

A WYSIWYG scene editor and runtime for building layered parallax backgrounds.

The package exposes two editor surfaces:

- `LabsThemeEditor`: the Labs-style WYSIWYG editor with the original floating `.te-*` panels, layer tree, drag/resize/rotate handles, scene filters, panel reset, 3D peek, and Parallax.js behavior.
- `ParallaxSceneStudio`: a smaller editor/runtime API for simple embeds and source-code export demos.

## Project Status

Parallax Scene Studio is an independent MIT-licensed project. It can work with Parallax.js-style layered scenes, but it is not the official editor for Parallax.js and is not affiliated with the original Parallax.js maintainers.

## Packages

```text
packages/parallax-scene-studio   Library source and npm package
apps/demo                        Public demo website
examples/basic-html              Minimal browser example
docs                             Integration and migration notes
```

## Install

```bash
npm install parallax-scene-studio
```

## Basic Usage

Labs-parity editor:

```js
import { LabsThemeEditor } from 'parallax-scene-studio';
import 'parallax-scene-studio/style.css';

new LabsThemeEditor({
  mount: '#editor',
  value: sceneConfig,
  showSourceCard: false,
  onSave(scene) {
    localStorage.setItem('scene', JSON.stringify(scene));
  },
  async onUpload(file) {
    // Return your own permanent asset URL here.
    return URL.createObjectURL(file);
  }
});
```

Lightweight editor:

```js
import { ParallaxSceneStudio } from 'parallax-scene-studio';
import 'parallax-scene-studio/style.css';

const editor = new ParallaxSceneStudio({
  mount: document.querySelector('#editor'),
  showSourceCard: true,
  onSave(scene) {
    localStorage.setItem('scene', JSON.stringify(scene));
  }
});
```

For private products, disable the source export card:

```js
new ParallaxSceneStudio({
  mount: '#editor',
  showSourceCard: false
});
```

## Scene Format

Scenes are plain JSON. The schema is intentionally small:

```json
{
  "schema_version": 1,
  "name": "Demo Scene",
  "type": "parallax",
  "scene": {
    "background_color": "#102336",
    "scalar_x": 10,
    "scalar_y": 10,
    "friction_x": 0.12,
    "friction_y": 0.12,
    "invert_x": true,
    "invert_y": true
  },
  "layer_offset": { "left": 0, "top": 0 },
  "layers": [
    {
      "name": "Background",
      "depth": 0.2,
      "elements": [
        {
          "image": "/assets/layer.png",
          "x": "-5%",
          "y": "-5%",
          "width": "110%",
          "height": "110%"
        }
      ]
    }
  ]
}
```

## Development

```bash
npm install
npm run dev
npm run build
```

## Demos

Vite demo:

```bash
npm run dev
```

Flask Lighthouse demo:

```bash
npm run build
cd apps/flask-demo
python3 -m pip install --target .python-packages -r requirements.txt
PYTHONPATH=.python-packages python3 app.py
```

## Uploads

The package does not ship storage credentials or a storage backend. Persistent uploads are handled through the `onUpload` callback.

- No backend: the demo uses temporary `blob:` URLs.
- Production: use your own backend to issue presigned S3/R2/Minio URLs or accept multipart uploads.
- Example: see [examples/backend-python-s3](examples/backend-python-s3) for a small FastAPI presigned-upload backend.

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

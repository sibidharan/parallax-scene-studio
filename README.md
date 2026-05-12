# Parallax Scene Studio

A WYSIWYG scene editor and runtime for building layered parallax backgrounds.

Parallax Scene Studio lets you visually compose image layers, tune depth, position sprites, add simple animations, and export a portable JSON scene config with the HTML, CSS, and JavaScript needed to render it.

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

Optional compatibility dependency:

```bash
npm install parallax-js
```

The package includes a built-in pointer engine, so Parallax.js is not required for the default runtime.

## Basic Usage

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

## Uploads

The package does not ship storage credentials or a storage backend. Persistent uploads are handled through the `onUpload` callback.

- No backend: the demo uses temporary `blob:` URLs.
- Production: use your own backend to issue presigned S3/R2/Minio URLs or accept multipart uploads.
- Example: see [examples/backend-python-s3](examples/backend-python-s3) for a small FastAPI presigned-upload backend.

## License

MIT. See [LICENSE](LICENSE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

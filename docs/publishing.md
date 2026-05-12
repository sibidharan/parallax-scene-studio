# Publishing

Parallax Scene Studio should be published from a clean public repository, not from the Labs dashboard repository history.

## GitHub

Recommended repository:

```text
github.com/sibidharan/parallax-scene-studio
```

Use this description:

```text
A WYSIWYG editor and runtime for layered parallax scenes.
```

Add this disclaimer in the GitHub About or README:

```text
Independent project. Not affiliated with the original Parallax.js maintainers.
```

## npm

Package name:

```text
parallax-scene-studio
```

Optional scoped package:

```text
@sibidharan/parallax-scene-studio
```

Before the first publish:

```bash
npm install
npm run build
npm pack -w packages/parallax-scene-studio
```

Publish:

```bash
npm publish -w packages/parallax-scene-studio --access public
```

## Demo

The demo app can deploy to GitHub Pages, Vercel, Netlify, or any static host:

```bash
npm run build -w apps/demo
```

The generated site is in:

```text
apps/demo/dist
```

## Release Checklist

- MIT license present
- README says WYSIWYG and independent project
- Third-party notices checked
- No Labs secrets, routes, internal docs, user uploads, or private assets
- Source-code card enabled in demo
- Source-code card disabled in Labs integration
- Package builds cleanly
- Demo builds cleanly

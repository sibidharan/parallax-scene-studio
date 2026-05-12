# Labs Migration Plan

The Labs dashboard should consume Parallax Scene Studio as a package, while Labs-only product behavior remains private.

## Public Package Owns

- Scene schema and migration helpers
- Scene renderer
- Pointer/parallax runtime
- WYSIWYG editor shell
- Layer, element, and child editing
- Undo/redo
- Import/export
- Optional source-code card
- Generic upload/save/preference callbacks

## Labs Owns

- Authentication
- MongoDB persistence
- S3/Minio uploads
- Theme slots and Jolt economy
- Admin review and marketplace workflow
- User preferences endpoint
- Labs sample cards
- Dashboard redirect behavior

## Adapter Boundary

```js
new ParallaxSceneStudio({
  mount: '#theme-editor',
  value: window.__themeEditorConfig,
  mode: window.__themeEditorMode,
  showSourceCard: false,
  onSave: labsSaveTheme,
  onUpload: labsUploadAsset,
  onPreferenceSave: labsSavePanelPositions,
  notify: labsToast,
  confirm: labsConfirm
});
```

## Migration Phases

1. Replace duplicated JS/PHP scene rendering with the package renderer.
2. Move shared color, schema, and sanitize helpers into the package.
3. Wrap the current Labs editor page with package initialization.
4. Move upload/save/review code behind Labs adapter callbacks.
5. Remove Labs-only strings and code paths from the package before publishing.


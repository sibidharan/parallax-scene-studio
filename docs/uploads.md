# Upload Adapters

Persistent uploads need a backend. The browser package should never contain AWS, S3, R2, Minio, or application credentials.

Parallax Scene Studio exposes one upload hook:

```ts
new ParallaxSceneStudio({
  mount: '#editor',
  async onUpload(file, context) {
    return { url: 'https://cdn.example.com/path/to/image.webp' };
  }
});
```

If `onUpload` is omitted, the editor uses `URL.createObjectURL(file)`. That is useful for demos, but it is not persistent. A reload loses access to the local blob URL.

## Option 1: Presigned S3 Upload

Recommended flow:

1. Browser asks your backend for a presigned upload URL.
2. Backend authenticates the user and returns `{ uploadUrl, publicUrl }`.
3. Browser uploads the file directly to S3/R2/Minio with `PUT`.
4. `onUpload` returns `publicUrl` to the editor.

```ts
new ParallaxSceneStudio({
  mount: '#editor',
  async onUpload(file) {
    const signed = await fetch('/api/theme-assets/presign', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size
      })
    }).then((res) => res.json());

    await fetch(signed.uploadUrl, {
      method: 'PUT',
      headers: { 'content-type': file.type },
      body: file
    });

    return { url: signed.publicUrl };
  }
});
```

Backend responsibilities:

- authenticate the user
- validate file type and size
- generate a scoped object key
- return a short-lived presigned URL
- store upload metadata if your app needs cleanup or billing

A complete small FastAPI example is included in:

```text
examples/backend-python-s3
```

## Option 2: Backend Multipart Upload

This is simpler to integrate with existing apps:

```ts
new ParallaxSceneStudio({
  mount: '#editor',
  async onUpload(file, context) {
    const form = new FormData();
    form.append('file', file);
    form.append('target', context.target);

    const response = await fetch('/api/theme-assets/upload', {
      method: 'POST',
      body: form
    }).then((res) => res.json());

    return { url: response.url };
  }
});
```

## Labs Adapter

Labs already has an authenticated upload endpoint. Keep it private and pass it as an adapter:

```ts
new ParallaxSceneStudio({
  mount: '#theme-editor',
  showSourceCard: false,
  async onUpload(file, context) {
    const form = new FormData();
    form.append('file', file);
    form.append('theme_id', context.scene.thumbnail_url ? context.scene.name : 'draft');

    const response = await fetch('/api/app/user_theme_upload', {
      method: 'POST',
      body: form
    }).then((res) => res.json());

    if (response.result !== 'success') {
      throw new Error(response.error || 'Upload failed');
    }

    return { url: response.url, id: response.upload_id };
  }
});
```

Labs can keep SVG sanitization, S3 paths, daily limits, orphan-to-used lifecycle, and user ownership checks in PHP.

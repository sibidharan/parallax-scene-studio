# Python S3 Upload Backend

Small FastAPI backend for persistent image uploads.

The browser editor never receives S3 credentials. It asks this backend for a short-lived presigned `PUT` URL, uploads the file directly to S3-compatible storage, then stores the returned public URL in the scene JSON.

Works with:

- AWS S3
- Minio
- Cloudflare R2
- DigitalOcean Spaces
- other S3-compatible object stores

## Setup

```bash
cd examples/backend-python-s3
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Fill in `.env`, then run:

```bash
uvicorn app:app --host 0.0.0.0 --port 8787 --reload
```

## Frontend Adapter

```ts
new ParallaxSceneStudio({
  mount: '#editor',
  async onUpload(file) {
    const signed = await fetch('http://localhost:8787/uploads/presign', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        filename: file.name,
        content_type: file.type,
        size: file.size
      })
    }).then((res) => res.json());

    await fetch(signed.upload_url, {
      method: 'PUT',
      headers: { 'content-type': file.type },
      body: file
    });

    return { url: signed.public_url };
  }
});
```

## Notes

- This example validates size, file extension, and MIME type.
- Production apps should authenticate users before issuing presigned URLs.
- Store metadata in your own database if you need ownership, cleanup, quotas, or billing.
- For private buckets, serve assets through a signed CDN or app route instead of returning a public URL.


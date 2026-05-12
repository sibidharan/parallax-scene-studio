import os
import re
import uuid
from datetime import datetime, timezone
from typing import Dict

import boto3
from botocore.config import Config
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

ALLOWED_MIME_TYPES = {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
}

app = FastAPI(title="Parallax Scene Studio S3 Upload Backend")

allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


class PresignRequest(BaseModel):
    filename: str = Field(min_length=1, max_length=160)
    content_type: str
    size: int = Field(gt=0)


class PresignResponse(BaseModel):
    upload_url: str
    public_url: str
    key: str
    method: str
    headers: Dict[str, str]


@app.get("/health")
def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.post("/uploads/presign", response_model=PresignResponse)
def presign_upload(req: PresignRequest) -> PresignResponse:
    max_bytes = int(os.getenv("MAX_UPLOAD_MB", "5")) * 1024 * 1024
    if req.size > max_bytes:
        raise HTTPException(status_code=413, detail=f"File must be under {max_bytes // 1024 // 1024} MB")

    expected_ext = ALLOWED_MIME_TYPES.get(req.content_type)
    if not expected_ext:
        raise HTTPException(status_code=400, detail="Only PNG, JPEG, WebP, and SVG images are allowed")

    safe_name = sanitize_filename(req.filename)
    if not safe_name.lower().endswith(tuple(ALLOWED_MIME_TYPES.values())):
        safe_name = f"{safe_name}{expected_ext}"

    bucket = require_env("S3_BUCKET")
    public_base_url = require_env("S3_PUBLIC_BASE_URL").rstrip("/")
    prefix = os.getenv("UPLOAD_PREFIX", "parallax-scenes").strip("/")
    today = datetime.now(timezone.utc).strftime("%Y/%m/%d")
    key = f"{prefix}/{today}/{uuid.uuid4().hex}_{safe_name}"

    client = boto3.client(
        "s3",
        region_name=os.getenv("S3_REGION", "us-east-1"),
        endpoint_url=os.getenv("S3_ENDPOINT_URL") or None,
        aws_access_key_id=require_env("S3_ACCESS_KEY_ID"),
        aws_secret_access_key=require_env("S3_SECRET_ACCESS_KEY"),
        config=Config(signature_version="s3v4"),
    )

    upload_url = client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": bucket,
            "Key": key,
            "ContentType": req.content_type,
        },
        ExpiresIn=300,
        HttpMethod="PUT",
    )

    return PresignResponse(
        upload_url=upload_url,
        public_url=f"{public_base_url}/{key}",
        key=key,
        method="PUT",
        headers={"content-type": req.content_type},
    )


def sanitize_filename(filename: str) -> str:
    base = filename.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
    base = re.sub(r"[^a-zA-Z0-9._-]+", "_", base).strip("._")
    return base or "image"


def require_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise HTTPException(status_code=500, detail=f"Server is missing {name}")
    return value


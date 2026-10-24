import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const endpoint =
  process.env.NEON_STORAGE_ENDPOINT ||
  process.env.AWS_ENDPOINT_URL_S3 ||
  undefined;

const region =
  process.env.NEON_STORAGE_REGION ||
  process.env.AWS_REGION ||
  "us-east-2";

const accessKeyId =
  process.env.NEON_STORAGE_ACCESS_KEY_ID ||
  process.env.AWS_ACCESS_KEY_ID ||
  "";

const secretAccessKey =
  process.env.NEON_STORAGE_SECRET_ACCESS_KEY ||
  process.env.AWS_SECRET_ACCESS_KEY ||
  "";

export const BUCKET_NAME =
  process.env.NEON_STORAGE_BUCKET_NAME ||
  process.env.AWS_BUCKET_NAME ||
  "fileflux-encrypted-vault";

export const s3Client = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true, // Recommended for S3-compatible endpoints
});

/**
 * Generate a short-lived, single-use presigned PUT URL for uploading encrypted ciphertext.
 */
export async function generateUploadPresignedUrl({
  objectKey,
  expiresIn = 900, // 15 minutes
}: {
  objectKey: string;
  expiresIn?: number;
}): Promise<{ presignedUrl: string; objectKey: string }> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    ContentType: "application/octet-stream", // Ciphertext binary stream
  });

  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });

  return {
    presignedUrl,
    objectKey,
  };
}

/**
 * Generate a short-lived presigned GET URL for downloading encrypted ciphertext.
 */
export async function generateDownloadPresignedUrl({
  objectKey,
  expiresIn = 900, // 15 minutes
}: {
  objectKey: string;
  expiresIn?: number;
}): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete an object from Neon Object Storage.
 */
export async function deleteStoredObject(objectKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  await s3Client.send(command);
}

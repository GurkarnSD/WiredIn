import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.S3REGION,
  credentials: {
    accessKeyId: process.env.S3ACCESS_KEY || "",
    secretAccessKey: process.env.S3SECRET_ACCESS_KEY || "",
  },
});
const BUCKET = process.env.S3BUCKET_NAME;

export default async function imageUploadUrl(userUID: string, type: string) {
  const ext = type.split("/")[1];
  const key = `${userUID}/${uuidv4()}.${ext}`;

  const { url, error } = await createPresignedUrl(key);

  return { url, key };
}

export async function createPresignedUrl(imageKey: string) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: imageKey,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 60 });
    return { url };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

export async function getUserPresignedUrl(imageKey: string) {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET, Key: imageKey });
    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    return { url };
  } catch (error) {
    console.log(error);
    return { error };
  }
}

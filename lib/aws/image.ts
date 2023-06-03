import S3 from "aws-sdk/clients/s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3({
  apiVersion: "2006-03-01",
  region: process.env.S3REGION,
  accessKeyId: process.env.S3ACCESS_KEY,
  secretAccessKey: process.env.S3SECRET_ACCESS_KEY,
  signatureVersion: "v4",
});

export default async function imageUpload(file: File) {
  const ext = file.type.split("/")[1];
  const Key = `${uuidv4()}.${ext}`;

  const params = {
    Bucket: process.env.S3BUCKET_NAME,
    Key: Key,
    Expires: 60,
    ContentType: `image/${ext}`,
  };

  const url = s3.getSignedUrl("putObject", params);

  return { url, key: Key };
}

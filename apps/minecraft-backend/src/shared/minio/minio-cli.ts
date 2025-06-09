import { S3Client, ListBucketsCommand, CreateBucketCommand } from "@aws-sdk/client-s3";
import { z } from "zod/v4";

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: `http://localhost:${process.env.MINIO_PORT}`, 
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD, 
  },
  forcePathStyle: true, 
});

const commands = {
  listBuckets: async () => {
    const result = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets:", result.Buckets);
  },

  createBucket: async (bucketName: string) => {
    const schema = z.string().nonempty("Bucket name is required");
    schema.parse(bucketName);

    await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket "${bucketName}" created.`);
  },
};

const [command, ...args] = process.argv.slice(2);

if (commands[command as keyof typeof commands]) {
  // @ts-expect-error
  commands[command as keyof typeof commands](...args).catch((err) => {
    console.error("Error:", err.message);
  });
} else {
  console.log("Available commands: listBuckets, createBucket <bucketName>");
}
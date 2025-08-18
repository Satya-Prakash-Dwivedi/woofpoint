import { S3Client } from "@aws-sdk/client-s3";

require('dotenv').config()

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: "AKIA54WIGJIIIRBHO4ER",
        secretAccessKey: "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",
    }
})

export default s3;
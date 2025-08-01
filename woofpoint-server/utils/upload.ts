import multer from "multer"
import multerS3 from "multer-s3"
import s3 from "./s3"

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME!,
        acl: 'public-read',
        key: function (req, file, cb) {
            const filename = `profile-photos/${Date.now()}-${file.originalname}`;
            cb(null, filename);
        },
    }),
})

export default upload;
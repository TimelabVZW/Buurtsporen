import { Controller, Post, Get, UploadedFiles, Param, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { S3 } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
});

const bucketName = process.env.S3_BUCKET_NAME;

@Controller('icon')
export class IconController {
  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        filename: (req, file, cb) => {
          const filename: string = uuidv4();
          const extension: string = file.originalname.split('.').pop();
          cb(null, `${filename}.${extension}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const fileNames = [];

    for (const file of files) {
      const fileData = createReadStream(file.path);

      const params = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fileData,
        ContentType: file.mimetype,
      };

      await s3.putObject(params);
      fileNames.push(file.filename);
    }

    const imageNames = fileNames.join('');
    return {
      url: `${process.env.AWS_ENDPOINT}/${bucketName}/${imageNames}`,
      fileName: imageNames,
    };
  }

  @Get('deleteSDK/:fileName')
  async deleteIcon(@Param('fileName') fileName: string) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    await s3.deleteObject(params);

    return { message: 'File deleted successfully' };
  }
}
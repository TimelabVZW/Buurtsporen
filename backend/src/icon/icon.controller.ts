import { Controller, Post, Get, UploadedFiles, Param, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { createReadStream } from 'fs';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.filename,
        Body: fileData,
        ACL: 'public-read',
        ContentType: file.mimetype,
      };

      await s3.upload(params).promise();
      fileNames.push(file.filename);
    }

    const imageNames = fileNames.join('');
    return {
      url: `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${imageNames}`,
      fileName: imageNames,
    };
  }
  @Get('deleteSDK/:fileName')
  async deleteIcon(@Param('fileName') fileName: string) {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    };

    await s3.deleteObject(params).promise();

    return { message: 'File deleted successfully' };
  }
}
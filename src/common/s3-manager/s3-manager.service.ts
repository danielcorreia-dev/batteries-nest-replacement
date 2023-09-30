import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3ManagerService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  private filenameToSlug(filename: string): string {
    const specialCharsMap = {
      á: 'a',
      à: 'a',
      ã: 'a',
      â: 'a',
      é: 'e',
      ê: 'e',
      í: 'i',
      ó: 'o',
      ô: 'o',
      õ: 'o',
      ú: 'u',
      ü: 'u',
      ç: 'c',
      ñ: 'n',
    };

    let slug: string = filename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    slug = slug.toLowerCase();

    slug = slug.replace(/[^a-z0-9]/g, (char) => specialCharsMap[char] || '_');

    slug = slug.replace(/\s+/g, '_');
    slug = slug.replace(/-+/g, '_');

    return slug;
  }

  async uploadFile(filename: string, content: string): Promise<any> {
    if (!content || !filename) {
      throw new Error('Filename and content cannot be empty');
    }

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.configService.get<string>('AWS_DEFAULT_S3_BUCKET'),
          Key: `${uuidv4()}_${filename}`,
          Body: content,
          ACL: 'public-read',
        },
        queueSize: 4,
        partSize: 5 * 1024 * 1024,
      });

      console.log('file uploaded');
      return await upload.done();
    } catch (error) {
      throw new Error('File upload failed');
    }
  }
}

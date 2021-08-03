import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';

@Injectable()
export class MinioService {
  private readonly logger = new Logger(MinioService.name);
  private readonly minioClient: Client;
  constructor(private configService: ConfigService) {
    this.minioClient = new Client({
      endPoint: this.configService.get<string>(
        'dinivas.minio.endPoint',
        'localhost'
      ),
      port: this.configService.get<number>('dinivas.minio.port', 9000),
      useSSL: this.configService.get<boolean>('dinivas.minio.useSSL', false),
      accessKey: this.configService.get<string>(
        'dinivas.minio.access_key',
        'minioadmin'
      ),
      secretKey: this.configService.get<string>(
        'dinivas.minio.secret_key',
        'minioadmin'
      ),
    });
  }

  doInBucket(
    bucketName: string,
    onBucket: (minio: Client, resolve, reject) => void
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.minioClient.bucketExists(bucketName, (err, exists) => {
        if (err) {
          reject(err);
        }
        if (!exists) {
          this.minioClient.makeBucket(bucketName, 'dinivas', (err) => {
            if (err) {
              reject(err);
            }
          });
          onBucket(this.minioClient, resolve, reject);
        } else {
          onBucket(this.minioClient, resolve, reject);
        }
      });
    });
  }
}
